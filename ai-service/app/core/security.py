"""Security and secret verification utilities."""

import hmac
from typing import Optional


class AppException(Exception):
    """Base application exception mapped to normalized ErrorEnvelope."""

    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


class AuthenticationError(AppException):
    """Raised when authentication credentials are missing or invalid (HTTP 401)."""

    def __init__(
        self,
        message: str = "Missing or invalid authentication credentials.",
        code: str = "UNAUTHORIZED",
    ) -> None:
        super().__init__(status_code=401, code=code, message=message)


class ForbiddenError(AppException):
    """Raised when caller lacks permission for the resource (HTTP 403)."""

    def __init__(
        self,
        message: str = "You do not have permission to perform this action.",
        code: str = "FORBIDDEN",
    ) -> None:
        super().__init__(status_code=403, code=code, message=message)


class NotFoundError(AppException):
    """Raised when resource cannot be found or accessed (HTTP 404)."""

    def __init__(
        self,
        message: str = "The requested resource was not found.",
        code: str = "NOT_FOUND",
    ) -> None:
        super().__init__(status_code=404, code=code, message=message)


def verify_shared_secret(provided_secret: Optional[str], expected_secret: str) -> bool:
    """Perform constant-time comparison of internal service secrets.

    Args:
        provided_secret: Secret string provided in the request header.
        expected_secret: Configured secret string from environment.

    Returns:
        bool: True if secrets match exactly and both are non-empty; False otherwise.
    """
    if not provided_secret or not expected_secret:
        return False

    # Prevent comparison of empty or whitespace-only values
    clean_provided = provided_secret.strip()
    clean_expected = expected_secret.strip()

    if not clean_provided or not clean_expected:
        return False

    return hmac.compare_digest(
        clean_provided.encode("utf-8"),
        clean_expected.encode("utf-8"),
    )
