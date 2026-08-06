from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app import chat, documents
from fastapi import APIRouter
from app.schemas import UserCreate, Token, UserResponse
from app.auth import get_password_hash, create_access_token, verify_password, get_current_user
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import User
import datetime


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title=settings.app_name,
    description="Full-featured AI Chatbot API with RAG, sessions, and document management",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth Router ─────────────────────────────────────────────────────────────

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    from app.json_db import get_user_by_email, create_user
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = create_user(user.email, hashed_password)
    return new_user


@auth_router.post("/login", response_model=Token)
async def login(user: UserCreate):
    from app.json_db import get_user_by_email
    user_dict = get_user_by_email(user.email)
    
    if not user_dict or not verify_password(user.password, user_dict["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token_expires = datetime.timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user_dict["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    return current_user

# ─── Register Routers ─────────────────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(chat.router)
app.include_router(documents.router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "google_api_configured": bool(settings.google_api_key),
    }
