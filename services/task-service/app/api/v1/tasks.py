from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.core.cache import cache_get, cache_set, cache_delete_pattern
from app.core.events import publish_event
from app.db.session import get_db
from app.repositories import ProjectRepository, TaskRepository
from app.schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/api/v1", tags=["tasks"])


def _tasks_key(project_id: UUID, status: str | None) -> str:
    return f"tasks:project:{project_id}:status:{status or 'all'}"


@router.post("/projects/{project_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    project_id: UUID,
    payload: TaskCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> TaskRead:
    if await ProjectRepository(db).get(project_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    task = await TaskRepository(db).create(
        project_id=project_id,
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        assignee_id=payload.assignee_id,
        created_by=user_id,
    )
    await cache_delete_pattern(f"tasks:project:{project_id}:*")

    # Best-effort async event — must NOT break task creation if the broker is down.
    # (Making this reliable is the outbox pattern — tomorrow, Day 10.)
    try:
        await publish_event("task.created", {
            "event": "task.created",
            "task_id": str(task.id),
            "project_id": str(project_id),
            "title": task.title,
            "created_by": str(user_id),
        })
    except Exception as exc:
        print(f"⚠️  Failed to publish task.created: {exc}")

    return task


@router.get("/projects/{project_id}/tasks", response_model=list[TaskRead])
async def list_tasks(
    project_id: UUID,
    status: str | None = Query(default=None, description="Filter: todo/in_progress/done"),
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    key = _tasks_key(project_id, status)
    cached = await cache_get(key)
    if cached is not None:
        print(f"CACHE HIT  {key}")
        return cached

    print(f"CACHE MISS {key}")
    tasks = await TaskRepository(db).list_for_project(project_id, status=status)
    payload = [TaskRead.model_validate(t).model_dump(mode="json") for t in tasks]
    await cache_set(key, payload)
    return payload


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
    updated = await repo.update(
        task,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        assignee_id=payload.assignee_id,
    )
    await cache_delete_pattern(f"tasks:project:{updated.project_id}:*")
    return updated