from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "TaskForge.AI AI Service"
    APP_VERSION: str = "0.1.0"

    QDRANT_URL: str = "http://localhost:6333"
    COLLECTION_NAME: str = "tasks"

    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    EMBEDDING_DIM: int = 384  # bge-small produces 384-dim vectors

    KAFKA_BOOTSTRAP: str = "localhost:9092"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore",
    )


settings = Settings()