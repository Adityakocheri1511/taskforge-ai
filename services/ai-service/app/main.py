from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.search import router as search_router
from app.core.vector_store import ensure_collection
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_collection()  # make sure the Qdrant collection exists on boot
    yield


app = FastAPI(title="TaskForge.AI AI Service", version="0.1.0", lifespan=lifespan)
app.include_router(search_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}