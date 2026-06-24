from jose import jwt

from app.core.config import settings


def decode_token(token: str) -> dict:
    """Validate a JWT issued by the Auth service. Raises jose.JWTError if invalid/expired."""
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])