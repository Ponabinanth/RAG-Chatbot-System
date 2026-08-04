import os
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

CHROMA_DATA_DIR = "./chroma_db"

def get_embeddings():
    if not settings.google_api_key:
        raise ValueError("Google API key is not configured for embeddings.")
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=settings.google_api_key
    )

def get_vector_store():
    embeddings = get_embeddings()
    return Chroma(
        collection_name="rag_documents",
        embedding_function=embeddings,
        persist_directory=CHROMA_DATA_DIR
    )
