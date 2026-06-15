from fastapi import FastAPI
from app.api.v1.auth import router as auth_router

app = FastAPI(title="TaskForge-AI")

# Include the router
app.include_router(auth_router, prefix="/api/v1")

app = FastAPI(
    title="TaskForge.AI Auth Service",
    version="0.1.0",
    description="Identity, authentication, and authorization for TaskForge.AI",
)

app.include_router(auth_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-service"}


@app.get("/")
async def root():
    return {"message": "TaskForge.AI Auth Service v0.1.0"}