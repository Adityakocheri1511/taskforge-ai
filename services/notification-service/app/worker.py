import asyncio
import json

import aio_pika

from app.core.config import settings

EXCHANGE_NAME = "taskforge.events"
QUEUE_NAME = "notifications.task_events"


async def handle_message(message: aio_pika.abc.AbstractIncomingMessage) -> None:
    # message.process() acks on success, and on exception rejects the message.
    async with message.process():
        payload = json.loads(message.body.decode())
        title = payload.get("title", "(untitled)")
        task_id = payload.get("task_id", "?")
        # Simulate sending an email / push notification:
        print(f"📧  Notification sent → new task '{title}' created (task_id={task_id})")


async def main() -> None:
    connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=10)  # backpressure: at most 10 unacked at once

    exchange = await channel.declare_exchange(
        EXCHANGE_NAME, aio_pika.ExchangeType.TOPIC, durable=True
    )
    queue = await channel.declare_queue(QUEUE_NAME, durable=True)
    await queue.bind(exchange, routing_key="task.*")

    print("🟢  Notification service is up. Waiting for task events… (CTRL+C to stop)")
    await queue.consume(handle_message)
    await asyncio.Future()  # run forever


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🔴  Notification service stopped.")