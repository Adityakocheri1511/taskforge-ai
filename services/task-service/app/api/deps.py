from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError

from app.core.security import decode_token

bearer_scheme = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> UUID:
    """
    Extract and validate the caller's user ID from the JWT.
    Note: the Task service has NO users table — it trusts the cryptographically
    signed token from the Auth service. This is stateless cross-service auth.
    """
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise cred_exc

    if payload.get("type") != "access":
        raise cred_exc

    sub = payload.get("sub")
    if sub is None:
        raise cred_exc

    return UUID(sub)