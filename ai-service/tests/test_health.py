"""Tests for health probe endpoints."""

from fastapi.testclient import TestClient


def test_root_health_endpoint(client: TestClient) -> None:
    """Verify that root /health endpoint returns 200 and safe health metadata."""
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "edusolve-ai-service"
    assert data["environment"] == "testing"

    # Confirm correlation ID is present on response headers
    assert "x-request-id" in response.headers

    # Confirm sensitive fields are never present in health response
    forbidden_keys = {"secret", "api_key", "password", "llm_key", "AI_SERVICE_SHARED_SECRET"}
    assert not any(k.lower() in forbidden_keys for k in data.keys())


def test_internal_v1_health_endpoint(client: TestClient) -> None:
    """Verify that /internal/v1/health endpoint functions without leaking configuration."""
    response = client.get("/internal/v1/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "edusolve-ai-service"
    assert data["environment"] == "testing"
    assert "x-request-id" in response.headers
