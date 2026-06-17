from fastapi import FastAPI

app = FastAPI(
    title="TaskForge.AI Task Service",
    version="0.1.0",
    description="Workspaces, projects, and tasks for TaskForge.AI",
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "task-service"}


@app.get("/")
async def root():
    return {"message": "TaskForge.AI Task Service v0.1.0"}