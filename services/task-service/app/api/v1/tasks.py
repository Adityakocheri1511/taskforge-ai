from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db.session import get_db
from app.repositories import ProjectRepository, TaskRepository
from app.schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/api/v1", tags=["tasks"])


@router.post("/projects/{project_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    project_id: UUID,
    payload: TaskCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> TaskRead:
    if await ProjectRepository(db).get(project_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return await TaskRepository(db).create(
        project_id=project_id,
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        assignee_id=payload.assignee_id,
        created_by=user_id,
    )


@router.get("/projects/{project_id}/tasks", response_model=list[TaskRead])
async def list_tasks(
    project_id: UUID,
    status: str | None = Query(default=None, description="Filter by status: todo/in_progress/done"),
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await TaskRepository(db).list_for_project(project_id, status=status)


@router.patch("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> TaskRead:
    repo = TaskRepository(db)
    task = await repo.get(task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return await repo.update(
        task,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        assignee_id=payload.assignee_id,
    )