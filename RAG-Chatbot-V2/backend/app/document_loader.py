import tempfile
import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from fastapi import UploadFile

async def process_upload(file: UploadFile):
    # Save the file temporarily
    suffix = Path(file.filename or "").suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        # Load document
        if suffix.lower() == '.pdf':
            loader = PyPDFLoader(tmp_path)
        elif suffix.lower() == '.docx':
            loader = Docx2txtLoader(tmp_path)
        else:
            loader = TextLoader(tmp_path)

        docs = loader.load()
        
        for doc in docs:
            doc.metadata["source"] = file.filename

        # Chunk the text
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(docs)
        
        return chunks
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
