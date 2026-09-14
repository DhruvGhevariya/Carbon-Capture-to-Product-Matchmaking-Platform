from pathlib import Path
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonX Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Configuration
    DATABASE_URL: str = "sqlite+aiosqlite:///./carbonx.db"
    SYNC_DATABASE_URL: Optional[str] = "sqlite:///./carbonx.db"

    # Redis Configuration
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"

    # JWT Security
    SECRET_KEY: str = "carbonx-super-secret-production-key-for-auth-token-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Match Engine Weights
    WEIGHT_TECHNICAL: float = 30.0
    WEIGHT_ECONOMIC: float = 25.0
    WEIGHT_ENVIRONMENTAL: float = 20.0
    WEIGHT_GEOGRAPHIC: float = 15.0
    WEIGHT_TRL: float = 10.0

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=(
            str(Path(__file__).resolve().parent.parent.parent / ".env"),
            ".env",
        ),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def sync_db_url(self) -> str:
        if self.SYNC_DATABASE_URL and self.SYNC_DATABASE_URL.strip():
            return self.SYNC_DATABASE_URL.strip()
        if "+asyncpg" in self.DATABASE_URL:
            return self.DATABASE_URL.replace("+asyncpg", "")
        if "+aiosqlite" in self.DATABASE_URL:
            return self.DATABASE_URL.replace("+aiosqlite", "")
        return self.DATABASE_URL

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


try:
    settings = Settings()
except Exception as e:
    settings = Settings(
        DATABASE_URL="sqlite+aiosqlite:///./carbonx.db",
        SYNC_DATABASE_URL="sqlite:///./carbonx.db",
    )
