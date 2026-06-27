import json

import aio_pika

from app.core.config import settings

EXCHANGE_NAME = "taskforge.events"

_exchange = None


async def _get_exchange() -> aio_pika.Exchange:
    """Lazily open a robust connection + topic exchange, reused across publishes."""
    global _exchange
    if _exchange is None:
        connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
        channel = await connection.channel()
        _exchange = await channel.declare_exchange(
            EXCHANGE_NAME, aio_pika.ExchangeType.TOPIC, durable=True
        )
    return _exchange


async def publish_event(routing_key: str, payload: dict) -> None:
    exchange = await _get_exchange()
    message = aio_pika.Message(
        body=json.dumps(payload).encode(),
        delivery_mode=aio_pika.DeliveryMode.PERSISTENT,  # survive broker restart
        content_type="application/json",
    )
    await exchange.publish(message, routing_key=routing_key)