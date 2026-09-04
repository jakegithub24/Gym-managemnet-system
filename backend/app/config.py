import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "GymForce API"
    PROJECT_DESCRIPTION: str = "Modern FastAPI backend for GymForce Gym Management System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-gymforce-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # Database (defaults to local SQLite, or PostgreSQL via DATABASE_URL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./gymforce.db")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
