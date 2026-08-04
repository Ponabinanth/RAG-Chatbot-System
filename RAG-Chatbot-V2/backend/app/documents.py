import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import get_current_user
from app.models import User, Document
from app.schemas import DocumentResponse
from app.database import get_db
from app.document_loader import process_upload
from app.config import settings

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not settings.google_api_key:
        raise HTTPException(status_code=503, detail="Google API key not configured for embeddings.")

    # Process and chunk the document
    try:
        chunks = await process_upload(file)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to process document: {str(e)}")

    if not chunks:
        raise HTTPException(status_code=422, detail="No text could be extracted from the file.")

    # Add user_id to metadata so we can filter by user
    for chunk in chunks:
        chunk.metadata["user_id"] = str(current_user.id)

    # Embed and store in ChromaDB
    try:
        from app.vector_store import get_vector_store
        vs = get_vector_store()
        ids = vs.add_documents(chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store embeddings: {str(e)}")

    # Persist document metadata to DB
    doc = Document(
        user_id=current_user.id,
        filename=file.filename or "unknown",
        chunk_count=len(chunks),
        collection_ids=json.dumps(ids),
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
    )
    return result.scalars().all()


@router.delete("/{doc_id}", status_code=204)
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Document).where(
            Document.id == doc_id,
            Document.user_id == current_user.id,
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove chunks from ChromaDB
    if doc.collection_ids:
        try:
            ids = json.loads(doc.collection_ids)
            from app.vector_store import get_vector_store
            vs = get_vector_store()
            vs.delete(ids=ids)
        except Exception:
            pass  # Best-effort deletion from vector store

    await db.delete(doc)
    await db.commit()
