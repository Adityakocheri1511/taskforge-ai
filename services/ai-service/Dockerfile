# ==============================================================
# AI Service — FastAPI + fastembed + Qdrant
# Note: fastembed downloads a ~130MB ONNX model on first use.
# The cache directory is a volume so it survives restarts and
# isn't re-downloaded on every container start.
# ==============================================================

FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN python -c "import tomllib, pathlib; d = tomllib.loads(pathlib.Path('pyproject.toml').read_text()); pathlib.Path('requirements.txt').write_text('\n'.join(d['project']['dependencies']))" \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.11-slim

RUN groupadd --system app && useradd --system --gid app --create-home app

WORKDIR /app

COPY --from=builder /install /usr/local
COPY --chown=app:app app ./app

# Model cache lives here; mounted as a volume in compose
RUN mkdir -p /home/app/.cache && chown -R app:app /home/app/.cache
ENV HF_HOME=/home/app/.cache \
    FASTEMBED_CACHE_PATH=/home/app/.cache

USER app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=3s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]