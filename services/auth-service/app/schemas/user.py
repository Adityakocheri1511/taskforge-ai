from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Request body for POST /auth/register."""
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=72)  # bcrypt limit is 72 bytes


class UserRead(BaseModel):
    """Response shape — NEVER includes the password hash."""
    model_config = ConfigDict(from_attributes=True)  # lets us build from ORM objects

    id: UUID
    email: EmailStr
    name: str
    is_active: bool
    is_verified: bool
    created_at: datetime