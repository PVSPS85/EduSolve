"""Tests verifying strict adherence to the project ErrorEnvelope specification."""

from fastapi.testclient import TestClient
from app.main import app


def test_404_not_found_error_envelope(client: TestClient) -> None:
    """Verify that a 404 response strictly adheres to ErrorEnvelope."""
    response = client.get("/non-existent-endpoint")
    assert response.status_code == 404

    data = response.json()
    assert "error" in data
    error = data["error"]
    assert "code" in error
    assert "message" in error
    assert "request_id" in error
    assert error["code"] == "NOT_FOUND"
    assert error["request_id"] is not None


def test_405_method_not_allowed_error_envelope(client: TestClient) -> None:
    """Verify that a 405 response strictly adheres to ErrorEnvelope."""
    response = client.post("/health")
    assert response.status_code == 405

    data = response.json()
    assert "error" in data
    error = data["error"]
    assert error["code"] == "METHOD_NOT_ALLOWED"
    assert error["request_id"] is not None


def test_validation_error_envelope(client: TestClient) -> None:
    """Verify that a request validation error returns 400 with ErrorEnvelope."""
    from pydantic import BaseModel, Field

    class SamplePayload(BaseModel):
        required_field: str = Field(..., min_length=5)

    @app.post("/test-validation-endpoint")
    async def sample_endpoint(payload: SamplePayload):
        return {"status": "ok"}

    # Send invalid payload (missing required_field)
    response = client.post("/test-validation-endpoint", json={})
    assert response.status_code == 400

    data = response.json()
    assert "error" in data
    error = data["error"]
    assert error["code"] == "VALIDATION_ERROR"
    assert "required_field" in error["message"]
    assert error["request_id"] is not None


def test_unhandled_exception_returns_safe_500_envelope() -> None:
    """Verify that unhandled exceptions do not leak stack traces and return 500 ErrorEnvelope."""
    # Temporarily add a test endpoint to trigger an unhandled Exception
    @app.get("/test-internal-crash")
    async def crash_endpoint():
        raise RuntimeError("Simulated unexpected internal database/LLM failure")

    with TestClient(app, raise_server_exceptions=False) as safe_client:
        response = safe_client.get("/test-internal-crash")
        assert response.status_code == 500

        data = response.json()
        assert "error" in data
        error = data["error"]
        assert error["code"] == "INTERNAL_SERVER_ERROR"
        # Verify internal traceback or sensitive error message is NOT exposed to caller
        assert "Simulated unexpected" not in error["message"]
        assert "Traceback" not in error["message"]
        assert error["request_id"] is not None
