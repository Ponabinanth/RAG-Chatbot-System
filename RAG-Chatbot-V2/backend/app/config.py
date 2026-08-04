from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "RAG Chatbot API"
    # Fallback to SQLite since Docker/Postgres is not available on this host
    database_url: str = "sqlite+aiosqlite:///./rag_chatbot.db"
    secret_key: str = "supersecretkey_please_change_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    google_api_key: str = "" # Required for Gemini

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
