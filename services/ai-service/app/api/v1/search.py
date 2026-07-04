from fastapi import APIRouter
from qdrant_client.models import PointStruct

from app.core.embeddings import embed
from app.core.vector_store import search, upsert_points
from app.schemas import IndexRequest, SearchHit, SearchRequest

router = APIRouter(prefix="/api/v1", tags=["ai"])


@router.post("/index")
async def index_tasks(req: IndexRequest) -> dict:
    texts = [f"{t.title}. {t.description or ''}".strip() for t in req.tasks]
    vectors = embed(texts)
    points = [
        PointStruct(id=t.id, vector=v, payload={"title": t.title})
        for t, v in zip(req.tasks, vectors)
    ]
    await upsert_points(points)
    return {"indexed": len(points)}


@router.post("/search", response_model=list[SearchHit])
async def semantic_search(req: SearchRequest) -> list[SearchHit]:
    query_vector = embed([req.query])[0]
    results = await search(query_vector, limit=req.limit)
    return [
        SearchHit(id=str(r.id), title=r.payload.get("title", ""), score=r.score)
        for r in results
    ]