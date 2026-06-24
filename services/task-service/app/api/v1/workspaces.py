from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db.session import get_db
from app.repositories import WorkspaceRepository
from app.schemas import WorkspaceCreate, WorkspaceRead

router = APIRouter(prefix="/api/v1/workspaces", tags=["workspaces"])


@router.post("", response_model=WorkspaceRead, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    payload: WorkspaceCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> WorkspaceRead:
    return await WorkspaceRepository(db).create(name=payload.name, owner_id=user_id)


@router.get("", response_model=list[WorkspaceRead])
async def list_workspaces(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await WorkspaceRepository(db).list_for_user(user_id)