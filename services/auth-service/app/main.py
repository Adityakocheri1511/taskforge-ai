from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.core.config import settings

app = FastAPI(
    title="TaskForge.AI Auth Service",
    version="0.1.0",
    description="Identity, authentication, and authorization for TaskForge.AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-service"}


@app.get("/")
async def root():
    return {"message": "TaskForge.AI Auth Service v0.1.0"}