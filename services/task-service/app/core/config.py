from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "TaskForge.AI Task Service"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    DATABASE_URL: str = (
        "postgresql+asyncpg://taskforge:taskforge_dev_password@localhost:5432/taskforge_tasks"
    )

    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 60

    RABBITMQ_URL: str = "amqp://taskforge:taskforge_dev_password@localhost:5672/"

    JWT_SECRET_KEY: str = "dev-secret-change-me-run-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore",
    )


settings = Settings()