import asyncio
import json
from collections import defaultdict

from aiokafka import AIOKafkaConsumer

from app.core.config import settings

KAFKA_TOPIC = "task-events"


async def main() -> None:
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=settings.KAFKA_BOOTSTRAP,
        group_id="analytics",            # our own consumer group
        auto_offset_reset="earliest",    # read the full history on first run
    )
    await consumer.start()
    print("🟢  Analytics service consuming 'task-events' (group=analytics)…")

    total = 0
    per_project: dict[str, int] = defaultdict(int)

    try:
        async for msg in consumer:
            payload = json.loads(msg.value.decode())
            total += 1
            pid = payload.get("project_id", "?")
            per_project[pid] += 1
            print(
                f"📊  task.created consumed | total={total} "
                f"| project {pid[:8]}… count={per_project[pid]} "
                f"(offset={msg.offset})"
            )
    finally:
        await consumer.stop()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🔴  Analytics service stopped.")