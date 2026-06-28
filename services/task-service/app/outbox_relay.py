import asyncio
from datetime import datetime, timezone

from aiokafka import AIOKafkaProducer
from sqlalchemy import select

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models import OutboxEvent

KAFKA_TOPIC = "task-events"
POLL_SECONDS = 2


async def relay_loop() -> None:
    producer = AIOKafkaProducer(bootstrap_servers=settings.KAFKA_BOOTSTRAP)
    await producer.start()
    print(f"🟢  Outbox relay started → topic '{KAFKA_TOPIC}'. Polling every {POLL_SECONDS}s…")
    try:
        while True:
            async with AsyncSessionLocal() as db:
                rows = (await db.execute(
                    select(OutboxEvent)
                    .where(OutboxEvent.published_at.is_(None))
                    .order_by(OutboxEvent.created_at)
                    .limit(20)
                )).scalars().all()

                for ev in rows:
                    await producer.send_and_wait(
                        KAFKA_TOPIC, ev.payload.encode(), key=ev.event_type.encode()
                    )
                    ev.published_at = datetime.now(timezone.utc)
                    print(f"📤  Relayed {ev.event_type} (id={ev.id}) → Kafka")

                if rows:
                    await db.commit()  # mark them published
            await asyncio.sleep(POLL_SECONDS)
    finally:
        await producer.stop()


if __name__ == "__main__":
    try:
        asyncio.run(relay_loop())
    except KeyboardInterrupt:
        print("\n🔴  Outbox relay stopped.")