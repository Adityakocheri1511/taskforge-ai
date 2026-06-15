from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token, hash_token,
)
from app.db.session import get_db
from app.repositories.token_repository import TokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas import UserCreate, UserRead, LoginRequest, TokenResponse, RefreshRequest

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


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


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await UserRepository(db).get_by_email(payload.email)

    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    access = create_access_token(str(user.id))
    refresh, expires_at = create_refresh_token(str(user.id))
    await TokenRepository(db).store(user_id=user.id, token_hash=hash_token(refresh), expires_at=expires_at)

    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    try:
        decoded = decode_token(payload.refresh_token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    if decoded.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not a refresh token")

    token_repo = TokenRepository(db)
    stored = await token_repo.get_valid(hash_token(payload.refresh_token))
    if not stored:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked or unknown")

    await token_repo.revoke(stored)
    user_id = decoded["sub"]
    access = create_access_token(user_id)
    new_refresh, expires_at = create_refresh_token(user_id)
    await token_repo.store(user_id=stored.user_id, token_hash=hash_token(new_refresh), expires_at=expires_at)

    return TokenResponse(access_token=access, refresh_token=new_refresh)