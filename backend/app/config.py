from pathlib import Path
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonX API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Configuration - values MUST come from .env (no hardcoded fallback credentials)
    DATABASE_URL: str
    SYNC_DATABASE_URL: Optional[str] = None

    # JWT Security
    SECRET_KEY: str = "change-this-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours shift

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=(
            str(Path(__file__).resolve().parent.parent / ".env"),
            ".env",
        ),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("DATABASE_URL is missing. Please configure DATABASE_URL in your .env file.")
        if "YOUR_PASSWORD" in v:
            raise ValueError(
                "DATABASE_URL contains placeholder 'YOUR_PASSWORD'. Please update .env with your actual PostgreSQL password."
            )
        return v.strip()

    @property
    def sync_database_url(self) -> str:
        if self.SYNC_DATABASE_URL and self.SYNC_DATABASE_URL.strip():
            return self.SYNC_DATABASE_URL.strip()
        # Derive sync driver from async driver
        return self.DATABASE_URL.replace("+asyncpg", "")

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


try:
    settings = Settings()
except Exception as e:
    raise RuntimeError(
        f"[CarbonX Config Error] Failed to load configuration: {e}. "
        "Ensure a valid .env file exists with a properly configured DATABASE_URL."
    ) from e
