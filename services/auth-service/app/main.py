from fastapi import FastAPI

app = FastAPI(
    title="TaskForge.AI Auth Service",
    version="0.1.0",
    description="Identity, authentication, and authorization for TaskForge.AI",
)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-service"}

@app.get("/")
async def root():
    return {"message": "TaskForge.AI Auth Service v0.1.0"}