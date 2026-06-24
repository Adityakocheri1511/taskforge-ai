from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# ---------- Workspace ----------
class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class WorkspaceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    owner_id: UUID
    created_at: datetime


# ---------- Project ----------
class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    workspace_id: UUID
    name: str
    description: str | None
    created_at: datetime


# ---------- Task ----------
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    priority: str = Field(default="medium")  # low / medium / high
    assignee_id: UUID | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    description: str | None = None
    status: str | None = None     # todo / in_progress / done
    priority: str | None = None
    assignee_id: UUID | None = None


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    project_id: UUID
    title: str
    description: str | None
    status: str
    priority: str
    assignee_id: UUID | None
    created_by: UUID
    created_at: datetime