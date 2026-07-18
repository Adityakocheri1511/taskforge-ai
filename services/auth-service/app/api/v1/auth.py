from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token, hash_token,
)
from app.db.session import get_db
from app.repositories.token_repository import TokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas import UserCreate, UserRead, LoginRequest, AccessTokenResponse
from app.api.deps import get_current_user
from app.models import User

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

REFRESH_COOKIE = "tf_refresh"
REFRESH_COOKIE_PATH = "/api/v1/auth"


def _set_refresh_cookie(response: Response, token: str) -> None:
    """
    Store the refresh token where JavaScript cannot reach it.

    httponly=True  -> document.cookie can't read it, so XSS can't exfiltrate it
    samesite="lax" -> not sent on cross-site requests (CSRF defense)
    secure=False   -> MUST be True in production (HTTPS only)
    path=...       -> only sent to auth endpoints (least privilege)
    """
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 3600,
        path=REFRESH_COOKIE_PATH,
    )


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> UserRead:
    repo = UserRepository(db)

    existing = await repo.get_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )

    user = await repo.create(
        email=payload.email,
        name=payload.name,
        hashed_password=hash_password(payload.password),
    )
    return user


@router.post("/login", response_model=AccessTokenResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> AccessTokenResponse:
    user = await UserRepository(db).get_by_email(payload.email)

    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    access = create_access_token(str(user.id))
    refresh, expires_at = create_refresh_token(str(user.id))
    await TokenRepository(db).store(user_id=user.id, token_hash=hash_token(refresh), expires_at=expires_at)

    # Refresh token goes into an httpOnly cookie — never into the response body.
    _set_refresh_cookie(response, refresh)
    return AccessTokenResponse(access_token=access)


@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> AccessTokenResponse:
    # The browser sends the cookie automatically; there is no request body.
    token = request.cookies.get(REFRESH_COOKIE)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    try:
        decoded = decode_token(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    if decoded.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not a refresh token")

    token_repo = TokenRepository(db)
    stored = await token_repo.get_valid(hash_token(token))
    if not stored:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked or unknown")

    # Rotation: the old token is revoked, a fresh one is issued and re-cookied.
    await token_repo.revoke(stored)
    user_id = decoded["sub"]
    access = create_access_token(user_id)
    new_refresh, expires_at = create_refresh_token(user_id)
    await token_repo.store(user_id=stored.user_id, token_hash=hash_token(new_refresh), expires_at=expires_at)

    _set_refresh_cookie(response, new_refresh)
    return AccessTokenResponse(access_token=access)


@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)) -> dict:
    """
    Clear the cookie AND revoke the token server-side.
    Clearing the cookie alone would leave a valid token in the DB.
    """
    token = request.cookies.get(REFRESH_COOKIE)
    if token:
        stored = await TokenRepository(db).get_valid(hash_token(token))
        if stored:
            await TokenRepository(db).revoke(stored)

    response.delete_cookie(REFRESH_COOKIE, path=REFRESH_COOKIE_PATH)
    return {"status": "logged out"}


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)) -> UserRead:
    """Return the currently authenticated user. Requires a valid access token."""
    return current_user