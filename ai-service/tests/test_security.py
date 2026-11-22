"""Tests for internal service authentication and security guarantees."""

import logging
from fastapi.testclient import TestClient
from app.core.security import verify_shared_secret


def test_internal_ping_with_valid_x_internal_secret(
    client: TestClient, valid_auth_headers: dict[str, str]
) -> None:
    """Verify that request with valid X-Internal-Secret is accepted."""
    response = client.get("/internal/v1/ping", headers=valid_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "pong"
    assert data["status"] == "ok"
    assert "x-request-id" in response.headers


def test_internal_ping_with_valid_bearer_token(
    client: TestClient, valid_bearer_headers: dict[str, str]
) -> None:
    """Verify that request with valid Bearer token is accepted as fallback."""
    response = client.get("/internal/v1/ping", headers=valid_bearer_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "pong"


def test_internal_ping_missing_secret_rejected(client: TestClient) -> None:
    """Verify that request with missing secret header is rejected with 401 and ErrorEnvelope."""
    response = client.get("/internal/v1/ping")
    assert response.status_code == 401

    data = response.json()
    assert "error" in data
    error = data["error"]
    assert error["code"] == "UNAUTHORIZED"
    assert "Missing" in error["message"]
    assert error["request_id"] is not None


def test_internal_ping_incorrect_secret_rejected(client: TestClient) -> None:
    """Verify that request with invalid secret is rejected with 401 and ErrorEnvelope."""
    response = client.get(
        "/internal/v1/ping",
        headers={"X-Internal-Secret": "completely-wrong-secret-key"},
    )
    assert response.status_code == 401

    data = response.json()
    assert "error" in data
    error = data["error"]
    assert error["code"] == "UNAUTHORIZED"
    assert "Invalid" in error["message"]
    assert error["request_id"] is not None


def test_internal_ping_whitespace_secret_rejected(client: TestClient) -> None:
    """Verify that request with empty or whitespace-only secret is rejected with 401."""
    response = client.get(
        "/internal/v1/ping",
        headers={"X-Internal-Secret": "   "},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "UNAUTHORIZED"


def test_verify_shared_secret_unit() -> None:
    """Unit test verify_shared_secret function directly for edge cases."""
    secret = "my-super-secret-token"

    # Exact match
    assert verify_shared_secret(secret, secret) is True

    # Mismatches
    assert verify_shared_secret("wrong-token", secret) is False
    assert verify_shared_secret(None, secret) is False
    assert verify_shared_secret("", secret) is False
    assert verify_shared_secret(secret, "") is False
    assert verify_shared_secret("  ", secret) is False
    assert verify_shared_secret(secret, "  ") is False


def test_secrets_do_not_appear_in_logs(
    client: TestClient, caplog
) -> None:
    """Ensure that internal secrets and sensitive headers are never logged."""
    sensitive_token = "secret-super-token-9876543210"
    with caplog.at_level(logging.DEBUG):
        response = client.get(
            "/internal/v1/ping",
            headers={"X-Internal-Secret": sensitive_token},
        )

    log_output = caplog.text

    # The actual secret must never appear in log text
    assert sensitive_token not in log_output
    # Header name with value must not be logged
    assert f"X-Internal-Secret: {sensitive_token}" not in log_output
