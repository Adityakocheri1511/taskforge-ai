from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db.session import get_db
from app.repositories import ProjectRepository, WorkspaceRepository
from app.schemas import ProjectCreate, ProjectRead

router = APIRouter(prefix="/api/v1/workspaces/{workspace_id}/projects", tags=["projects"])


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    workspace_id: UUID,
    payload: ProjectCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ProjectRead:
    if await WorkspaceRepository(db).get(workspace_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return await ProjectRepository(db).create(
        workspace_id=workspace_id, name=payload.name, description=payload.description
    )


@router.get("", response_model=list[ProjectRead])
async def list_projects(
    workspace_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await ProjectRepository(db).list_for_workspace(workspace_id)