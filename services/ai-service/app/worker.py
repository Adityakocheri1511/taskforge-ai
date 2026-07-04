import asyncio
import json

from aiokafka import AIOKafkaConsumer
from qdrant_client.models import PointStruct

from app.core.config import settings
from app.core.embeddings import embed
from app.core.vector_store import ensure_collection, upsert_points

KAFKA_TOPIC = "task-events"


async def main() -> None:
    await ensure_collection()
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=settings.KAFKA_BOOTSTRAP,
        group_id="ai-indexer",            # our own group — independent of analytics
        auto_offset_reset="earliest",
    )
    await consumer.start()
    print("🟢  AI indexer consuming 'task-events' (group=ai-indexer)…")
    try:
        async for msg in consumer:
            payload = json.loads(msg.value.decode())
            task_id = payload["task_id"]
            title = payload.get("title", "")
            vector = embed([title])[0]
            await upsert_points([
                PointStruct(id=task_id, vector=vector, payload={"title": title})
            ])
            print(f"🧠  Indexed task '{title}' (id={task_id[:8]}…)")
    finally:
        await consumer.stop()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🔴  AI indexer stopped.")