"""FastAPI dependency injection utilities."""

from typing import Optional
from fastapi import Header, Request
from app.config import get_settings
from app.core.security import AuthenticationError, verify_shared_secret


async def verify_internal_auth(
    request: Request,
    x_internal_secret: Optional[str] = Header(None, alias="X-Internal-Secret"),
    authorization: Optional[str] = Header(None, alias="Authorization"),
) -> bool:
    """Validate internal service-to-service authentication.

    Checks the authoritative 'X-Internal-Secret' header, or alternatively
    an 'Authorization: Bearer <secret>' token passed from Supabase Edge Functions.

    Raises:
        AuthenticationError: If the secret is missing, empty, or incorrect.

    Returns:
        bool: True if authorized.
    """
    settings = get_settings()
    expected_secret = settings.AI_SERVICE_SHARED_SECRET

    if not expected_secret or not expected_secret.strip():
        # Server-side configuration guard
        raise AuthenticationError(
            message="Internal service secret is not configured on the server.",
            code="UNAUTHORIZED",
        )

    # Determine provided secret (priority: X-Internal-Secret, fallback: Bearer)
    provided_secret: Optional[str] = None

    if x_internal_secret and x_internal_secret.strip():
        provided_secret = x_internal_secret.strip()
    elif authorization and authorization.strip():
        parts = authorization.strip().split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            provided_secret = parts[1]
        elif len(parts) == 1:
            provided_secret = parts[0]

    if not provided_secret:
        raise AuthenticationError(
            message="Missing required internal service authentication credentials.",
            code="UNAUTHORIZED",
        )

    if not verify_shared_secret(provided_secret, expected_secret):
        raise AuthenticationError(
            message="Invalid internal service authentication credentials.",
            code="UNAUTHORIZED",
        )

    return True
