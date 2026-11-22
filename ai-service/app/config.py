"""Application settings using Pydantic Settings."""

from functools import lru_cache
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Core Application Settings
    APP_ENV: str = Field(
        default="development",
        description="Application runtime environment: development, testing, production",
    )
    APP_HOST: str = Field(
        default="0.0.0.0",
        description="Host interface for server binding",
    )
    APP_PORT: int = Field(
        default=8000,
        description="Port for server binding",
    )
    LOG_LEVEL: str = Field(
        default="INFO",
        description="Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL",
    )

    # Service-to-Service Authentication
    AI_SERVICE_SHARED_SECRET: str = Field(
        default="",
        description="Shared secret key for authenticating internal requests from Supabase Edge Functions",
    )

    # LLM Provider Configuration (Unset/configurable in future phases)
    LLM_PROVIDER: Optional[str] = Field(
        default=None,
        description="Target LLM provider name (e.g. gemini, openai)",
    )
    LLM_MODEL: Optional[str] = Field(
        default=None,
        description="Target LLM model identifier",
    )
    LLM_API_KEY: Optional[str] = Field(
        default=None,
        description="API key for LLM provider",
    )

    # CrewAI Storage & Execution Settings
    CREWAI_STORAGE_DIR: str = Field(
        default="/tmp/crewai_storage",
        description="Directory for CrewAI runtime storage and telemetry caches",
    )


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings instance."""
    return Settings()
