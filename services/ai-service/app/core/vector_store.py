from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.core.config import settings

client = AsyncQdrantClient(url=settings.QDRANT_URL)


async def ensure_collection() -> None:
    """Create the collection (cosine distance) if it doesn't exist yet."""
    existing = await client.get_collections()
    names = {c.name for c in existing.collections}
    if settings.COLLECTION_NAME not in names:
        await client.create_collection(
            collection_name=settings.COLLECTION_NAME,
            vectors_config=VectorParams(
                size=settings.EMBEDDING_DIM, distance=Distance.COSINE
            ),
        )


async def upsert_points(points: list[PointStruct]) -> None:
    await client.upsert(collection_name=settings.COLLECTION_NAME, points=points)


async def search(vector: list[float], limit: int = 5):
    response = await client.query_points(
        collection_name=settings.COLLECTION_NAME,
        query=vector,
        limit=limit,
    )
    return response.points