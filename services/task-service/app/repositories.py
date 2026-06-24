from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Workspace, Membership, Project, Task


class WorkspaceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, *, name: str, owner_id: UUID) -> Workspace:
        ws = Workspace(name=name, owner_id=owner_id)
        self.db.add(ws)
        await self.db.flush()
        # Owner is automatically a member with role "owner"
        self.db.add(Membership(workspace_id=ws.id, user_id=owner_id, role="owner"))
        await self.db.flush()
        await self.db.refresh(ws)
        return ws

    async def list_for_user(self, user_id: UUID):
        result = await self.db.execute(
            select(Workspace)
            .join(Membership, Membership.workspace_id == Workspace.id)
            .where(Membership.user_id == user_id)
        )
        return result.scalars().all()

    async def get(self, workspace_id: UUID) -> Workspace | None:
        result = await self.db.execute(select(Workspace).where(Workspace.id == workspace_id))
        return result.scalar_one_or_none()


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, *, workspace_id: UUID, name: str, description: str | None) -> Project:
        p = Project(workspace_id=workspace_id, name=name, description=description)
        self.db.add(p)
        await self.db.flush()
        await self.db.refresh(p)
        return p

    async def list_for_workspace(self, workspace_id: UUID):
        result = await self.db.execute(select(Project).where(Project.workspace_id == workspace_id))
        return result.scalars().all()

    async def get(self, project_id: UUID) -> Project | None:
        result = await self.db.execute(select(Project).where(Project.id == project_id))
        return result.scalar_one_or_none()


class TaskRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, *, project_id: UUID, title: str, description: str | None,
                     priority: str, assignee_id: UUID | None, created_by: UUID) -> Task:
        t = Task(
            project_id=project_id, title=title, description=description,
            priority=priority, assignee_id=assignee_id, created_by=created_by,
        )
        self.db.add(t)
        await self.db.flush()
        await self.db.refresh(t)
        return t

    async def list_for_project(self, project_id: UUID, status: str | None = None):
        stmt = select(Task).where(Task.project_id == project_id)
        if status is not None:
            stmt = stmt.where(Task.status == status)   # uses the (project_id, status) composite index
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get(self, task_id: UUID) -> Task | None:
        result = await self.db.execute(select(Task).where(Task.id == task_id))
        return result.scalar_one_or_none()

    async def update(self, task: Task, **fields) -> Task:
        for key, value in fields.items():
            if value is not None:
                setattr(task, key, value)
        await self.db.flush()
        await self.db.refresh(task)
        return task