from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses pydantic-settings for type-safe config.
    """

    # Application
    APP_NAME: str = "TaskForge.AI Auth Service"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://taskforge:taskforge_dev_password@localhost:5432/taskforge"
    )

    # Sync version of database URL (Alembic doesn't support async)
    DATABASE_URL_SYNC: str = (
        "postgresql://taskforge:taskforge_dev_password@localhost:5432/taskforge"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()