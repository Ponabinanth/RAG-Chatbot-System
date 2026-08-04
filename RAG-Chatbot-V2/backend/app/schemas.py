from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# ─── Chat ────────────────────────────────────────────────────────────────────

class ChatMessageSchema(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: int
    use_rag: bool = True


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Sessions ────────────────────────────────────────────────────────────────

class SessionCreate(BaseModel):
    title: Optional[str] = "New Chat"


class SessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SessionWithMessages(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True


# ─── Documents ───────────────────────────────────────────────────────────────

class DocumentResponse(BaseModel):
    id: int
    filename: str
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True
