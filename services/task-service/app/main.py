from fastapi import FastAPI

from app.api.v1.workspaces import router as workspaces_router
from app.api.v1.projects import router as projects_router
from app.api.v1.tasks import router as tasks_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TaskForge.AI Task Service",
    version="0.1.0",
    description="Workspaces, projects, and tasks for TaskForge.AI",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workspaces_router)
app.include_router(projects_router)
app.include_router(tasks_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "task-service"}


@app.get("/")
async def root():
    return {"message": "TaskForge.AI Task Service v0.1.0"}