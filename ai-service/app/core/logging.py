"""Structured logging configuration and privacy protection."""

import contextvars
import json
import logging
import re
import sys
from typing import Any, Dict, Optional

# Context variable for request correlation ID
correlation_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "correlation_id", default=None
)

# Sensitive patterns that must never appear in logs
SENSITIVE_FIELD_NAMES = {
    "authorization",
    "x-internal-secret",
    "apikey",
    "api_key",
    "secret",
    "ai_service_shared_secret",
    "llm_api_key",
    "password",
    "token",
    "bearer",
    "email",
    "phone",
    "registration_identifier",
    "legal_name",
}

# Regex to detect potential API keys / secrets / auth tokens
SECRET_REGEX = re.compile(
    r"(Bearer\s+[\w\.\-]+|sk-[\w\-]{20,}|AIza[\w\-]{30,}|[0-9a-f]{32,64})",
    re.IGNORECASE,
)


class PrivacyFilter(logging.Filter):
    """Filter that ensures no sensitive secrets or PII leak into log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            record.msg = SECRET_REGEX.sub("[REDACTED_SECRET]", record.msg)
        return True


class JsonFormatter(logging.Formatter):
    """Format log records as structured JSON."""

    def format(self, record: logging.LogRecord) -> str:
        log_payload: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Attach request correlation ID if available in context
        req_id = correlation_id_ctx.get()
        if req_id:
            log_payload["request_id"] = req_id

        # Attach extra safe operational metadata if provided
        for attr, value in record.__dict__.items():
            if attr not in logging.LogRecord.__dict__ and not attr.startswith("_"):
                lower_attr = attr.lower()
                if any(s in lower_attr for s in SENSITIVE_FIELD_NAMES):
                    log_payload[attr] = "[REDACTED]"
                elif isinstance(value, (str, int, float, bool, list, dict)) or value is None:
                    log_payload[attr] = value

        if record.exc_info and not record.exc_text:
            record.exc_text = self.formatException(record.exc_info)
        if record.exc_text:
            log_payload["exception"] = record.exc_text

        return json.dumps(log_payload)


def configure_logging(log_level: str = "INFO") -> logging.Logger:
    """Configure structured JSON logging for the application."""
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level.upper())

    # Clear existing handlers
    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level.upper())
    handler.setFormatter(JsonFormatter())
    handler.addFilter(PrivacyFilter())

    root_logger.addHandler(handler)

    # Silence overly verbose external loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    return logging.getLogger("edusolve.ai")
