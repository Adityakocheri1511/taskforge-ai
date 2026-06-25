import json

import redis.asyncio as redis

from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


async def cache_get(key: str):
    """Return the deserialized value, or None on a miss."""
    raw = await redis_client.get(key)
    return json.loads(raw) if raw is not None else None


async def cache_set(key: str, value, ttl: int | None = None) -> None:
    await redis_client.set(key, json.dumps(value), ex=ttl or settings.CACHE_TTL_SECONDS)


async def cache_delete_pattern(pattern: str) -> None:
    """Delete-on-write: remove every key matching a pattern (e.g. all status variants for a project)."""
    keys = [k async for k in redis_client.scan_iter(match=pattern)]
    if keys:
        await redis_client.delete(*keys)