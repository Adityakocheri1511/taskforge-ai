from fastembed import TextEmbedding

from app.core.config import settings

_model: TextEmbedding | None = None


def _get_model() -> TextEmbedding:
    """Lazy-load the model once (first call downloads it, ~130MB)."""
    global _model
    if _model is None:
        _model = TextEmbedding(model_name=settings.EMBEDDING_MODEL)
    return _model


def embed(texts: list[str]) -> list[list[float]]:
    """Turn a list of strings into a list of 384-dim vectors."""
    model = _get_model()
    return [vector.tolist() for vector in model.embed(texts)]