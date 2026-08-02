from __future__ import annotations

import time
import uuid
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import chromadb
from chromadb.config import Settings


@dataclass
class Document:
    document_id: str
    filename: str
    title: str
    source: str
    text: str
    created_at: float


@dataclass
class VectorChunk:
    chunk_id: str
    document_id: str
    chunk_index: int
    text: str
    vector: list[float]


class LocalVectorStore:
    def __init__(self, path: Path) -> None:
        self.path = path
        # Use the directory containing the original index.json as the ChromaDB directory
        self.client = chromadb.PersistentClient(
            path=str(self.path.parent),
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name="rag_chunks",
            metadata={"hnsw:space": "cosine"}
        )
        self.documents: dict[str, Document] = {}
        # Keep documents in memory or load from DB if needed, but for simplicity we can
        # just store document metadata in another collection or in a file.
        # However, to maintain compatibility with the original LocalVectorStore interface
        # where `self.documents` is accessed directly in main.py, let's keep it sync'd.
        self._load_documents()

    def _load_documents(self) -> None:
        doc_collection = self.client.get_or_create_collection(name="rag_documents")
        results = doc_collection.get()
        self.documents = {}
        if results and results["ids"]:
            for i in range(len(results["ids"])):
                meta = results["metadatas"][i] if results["metadatas"] else {}
                doc = Document(
                    document_id=results["ids"][i],
                    filename=meta.get("filename", ""),
                    title=meta.get("title", ""),
                    source=meta.get("source", ""),
                    text=results["documents"][i] if results["documents"] else "",
                    created_at=float(meta.get("created_at", 0.0)),
                )
                self.documents[doc.document_id] = doc
                
    def _save_document(self, doc: Document) -> None:
        doc_collection = self.client.get_or_create_collection(name="rag_documents")
        doc_collection.upsert(
            ids=[doc.document_id],
            documents=[doc.text],
            metadatas=[{
                "filename": doc.filename,
                "title": doc.title,
                "source": doc.source,
                "created_at": doc.created_at,
            }]
        )

    def _delete_document_meta(self, document_id: str) -> None:
        doc_collection = self.client.get_or_create_collection(name="rag_documents")
        doc_collection.delete(ids=[document_id])

    @property
    def chunks(self) -> dict:
        # main.py does: len(store.chunks) and sum(1 for chunk in store.chunks.values() if chunk.document_id == document_id)
        # It's expensive to load all chunks into memory. We will emulate the dictionary interface.
        # Actually, let's just return a mock dict-like object for compatibility.
        class ChunksMock(dict):
            def __init__(self, collection):
                self.collection = collection
                
            def __len__(self):
                return self.collection.count()
                
            def values(self):
                results = self.collection.get(include=["metadatas"])
                if not results or not results["metadatas"]:
                    return []
                # Return dummy chunk objects that just have document_id
                return [VectorChunk(chunk_id="", document_id=m["document_id"], chunk_index=0, text="", vector=[]) for m in results["metadatas"]]
                
        return ChunksMock(self.collection)

    def load(self) -> None:
        pass # Handled by ChromaDB PersistentClient

    def save(self) -> None:
        pass # Handled by ChromaDB automatically

    def add_document(
        self,
        *,
        filename: str,
        title: str,
        source: str,
        text: str,
        chunks: list[tuple[int, str, list[float]]],
    ) -> Document:
        document_id = f"doc_{uuid.uuid4().hex[:12]}"
        document = Document(
            document_id=document_id,
            filename=filename,
            title=title,
            source=source,
            text=text,
            created_at=time.time(),
        )
        self.documents[document_id] = document
        self._save_document(document)
        
        if not chunks:
            return document
            
        ids = []
        embeddings = []
        documents_list = []
        metadatas = []
        
        for chunk_index, chunk_text, vector in chunks:
            chunk_id = f"{document_id}:{chunk_index:04d}"
            ids.append(chunk_id)
            embeddings.append(vector)
            documents_list.append(chunk_text)
            metadatas.append({
                "document_id": document_id,
                "chunk_index": chunk_index,
            })
            
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents_list,
            metadatas=metadatas
        )
        
        return document

    def delete_document(self, document_id: str) -> bool:
        if document_id not in self.documents:
            return False
        
        self.documents.pop(document_id)
        self._delete_document_meta(document_id)
        
        # Delete chunks associated with document_id
        self.collection.delete(where={"document_id": document_id})
        
        return True

    def search(self, query_vector: list[float], top_k: int) -> list[dict[str, Any]]:
        if self.collection.count() == 0:
            return []
            
        results = self.collection.query(
            query_embeddings=[query_vector],
            n_results=min(top_k, self.collection.count()),
            include=["documents", "metadatas", "distances"]
        )
        
        if not results or not results["ids"] or not results["ids"][0]:
            return []
            
        hits = []
        for i in range(len(results["ids"][0])):
            chunk_id = results["ids"][0][i]
            text = results["documents"][0][i]
            meta = results["metadatas"][0][i]
            distance = results["distances"][0][i]
            
            # ChromaDB cosine distance: 0 is identical, 2 is opposite. 
            # We want similarity (higher is better, 1 is identical)
            # Similarity = 1 - distance
            similarity = 1.0 - distance
            
            doc_id = meta["document_id"]
            document = self.documents.get(doc_id)
            if not document:
                continue
                
            chunk = VectorChunk(
                chunk_id=chunk_id,
                document_id=doc_id,
                chunk_index=meta["chunk_index"],
                text=text,
                vector=[] # Omitted to save memory
            )
            hits.append({"score": similarity, "chunk": chunk, "document": document})
            
        return hits
