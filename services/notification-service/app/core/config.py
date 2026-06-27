from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "TaskForge.AI Notification Service"
    RABBITMQ_URL: str = "amqp://taskforge:taskforge_dev_password@localhost:5672/"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore",
    )


settings = Settings()