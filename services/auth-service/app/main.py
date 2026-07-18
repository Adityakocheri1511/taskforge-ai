from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router

app = FastAPI(
    title="TaskForge.AI Auth Service",
    version="0.1.0",
    description="Identity, authentication, and authorization for TaskForge.AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # explicit — never "*" with credentials
    allow_credentials=True,                   # required for httpOnly cookies
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