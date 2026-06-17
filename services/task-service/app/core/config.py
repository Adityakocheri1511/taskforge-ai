from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "TaskForge.AI Task Service"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # Task service owns its OWN database — separate from Auth's
    DATABASE_URL: str = (
        "postgresql+asyncpg://taskforge:taskforge_dev_password@localhost:5432/taskforge_tasks"
    )

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore",
    )


settings = Settings()