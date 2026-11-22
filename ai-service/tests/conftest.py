"""Pytest fixtures and configuration."""

import os
from typing import Generator
import pytest
from fastapi.testclient import TestClient

# Configure test environment variables prior to importing app
os.environ["APP_ENV"] = "testing"
os.environ["AI_SERVICE_SHARED_SECRET"] = "test-secure-internal-secret-xyz"
os.environ["LOG_LEVEL"] = "DEBUG"

from app.config import get_settings
from app.main import app


@pytest.fixture(autouse=True)
def reset_settings() -> None:
    """Clear cached settings before each test."""
    get_settings.cache_clear()


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Provide a TestClient instance for testing endpoints."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def valid_auth_headers() -> dict[str, str]:
    """Provide valid authentication headers matching test secret."""
    return {"X-Internal-Secret": "test-secure-internal-secret-xyz"}


@pytest.fixture
def valid_bearer_headers() -> dict[str, str]:
    """Provide valid bearer token authentication headers."""
    return {"Authorization": "Bearer test-secure-internal-secret-xyz"}
