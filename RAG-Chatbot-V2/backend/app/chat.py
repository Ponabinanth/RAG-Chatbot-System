import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update as sql_update

from app.auth import get_current_user
from app.models import User, ChatSession, ChatMessage
from app.schemas import ChatRequest, SessionCreate, SessionResponse, SessionWithMessages, ChatMessageResponse
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/chat", tags=["chat"])

SYSTEM_PROMPT = """You are an intelligent, helpful, and friendly AI assistant. You answer all questions thoroughly and clearly.

Key behaviors:
- Provide detailed, accurate answers to any question
- Format responses using Markdown when helpful (headers, lists, code blocks, bold text)
- For code questions, always include working code examples with syntax highlighting
- For math or technical topics, be precise and thorough
- If context documents are provided via RAG, cite them and use that information prominently
- Be conversational and empathetic
- If you don't know something, say so honestly rather than making up information
- Keep responses well-structured and easy to read

You have access to user-uploaded documents when relevant context is provided."""

def get_llm():
    if not settings.google_api_key:
        return None
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=settings.google_api_key,
        streaming=True,
        temperature=0.7,
    )


# ─── Session Endpoints ────────────────────────────────────────────────────────

@router.post("/sessions", response_model=SessionResponse)
async def create_session(
    body: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session = ChatSession(user_id=current_user.id, title=body.title or "New Chat")
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/sessions", response_model=list[SessionResponse])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
    )
    return result.scalars().all()


@router.get("/sessions/{session_id}", response_model=SessionWithMessages)
async def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    msgs_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    session.messages = msgs_result.scalars().all()
    return session


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()


@router.patch("/sessions/{session_id}/title")
async def update_session_title(
    session_id: int,
    body: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.title = body.title
    await db.commit()
    return {"ok": True}


# ─── Streaming Chat Endpoint ──────────────────────────────────────────────────

@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    llm = get_llm()
    if not llm:
        raise HTTPException(status_code=503, detail="Google API key not configured. Add GOOGLE_API_KEY to backend/.env")

    # Validate session ownership
    session_result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id,
        )
    )
    session = session_result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Load prior messages from DB
    msgs_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == request.session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    prior_messages = msgs_result.scalars().all()

    # Build RAG context if enabled
    rag_context = ""
    if request.use_rag and settings.google_api_key:
        try:
            from app.vector_store import get_vector_store
            vs = get_vector_store()
            docs = vs.similarity_search(request.message, k=4)
            if docs:
                context_parts = []
                for i, doc in enumerate(docs, 1):
                    source = doc.metadata.get("source", "Document")
                    context_parts.append(f"[{i}] Source: {source}\n{doc.page_content}")
                rag_context = "\n\n---\n\n".join(context_parts)
        except Exception:
            pass  # RAG is optional, don't fail the whole request

    # Build message list for LLM
    system_content = SYSTEM_PROMPT
    if rag_context:
        system_content += f"\n\n## Relevant Context from Uploaded Documents:\n\n{rag_context}\n\nUse the above context to answer the user's question when relevant."

    messages = [SystemMessage(content=system_content)]
    for msg in prior_messages:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            messages.append(AIMessage(content=msg.content))

    messages.append(HumanMessage(content=request.message))

    # Persist user message
    user_msg = ChatMessage(
        session_id=request.session_id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)

    # Auto-title the session from first message
    if not prior_messages and session.title == "New Chat":
        title = request.message[:60].strip()
        if len(request.message) > 60:
            title += "…"
        session.title = title

    await db.commit()

    # Stream response and accumulate for persistence
    accumulated = []

    async def generate():
        try:
            async for chunk in llm.astream(messages):
                if chunk.content:
                    accumulated.append(chunk.content)
                    yield f"data: {json.dumps({'content': chunk.content})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

        # Persist assistant message after streaming
        full_response = "".join(accumulated)
        if full_response:
            async with db.begin():
                asst_msg = ChatMessage(
                    session_id=request.session_id,
                    role="assistant",
                    content=full_response,
                )
                db.add(asst_msg)
                # Touch updated_at on session
                await db.execute(
                    sql_update(ChatSession)
                    .where(ChatSession.id == request.session_id)
                    .values(updated_at=__import__("datetime").datetime.utcnow())
                )

    return StreamingResponse(generate(), media_type="text/event-stream")
