# ==============================================================
# Analytics Service — Kafka consumer worker (group: analytics)
# ==============================================================

FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
# Install ONLY the dependencies, not the project itself — the app code
# isn't here yet, and keeping it out is what preserves the layer cache.
RUN python -c "import tomllib, pathlib; d = tomllib.loads(pathlib.Path('pyproject.toml').read_text()); pathlib.Path('requirements.txt').write_text('\n'.join(d['project']['dependencies']))" \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.11-slim

RUN groupadd --system app && useradd --system --gid app --create-home app

WORKDIR /app

COPY --from=builder /install /usr/local
COPY --chown=app:app app ./app

USER app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

CMD ["python", "-m", "app.worker"]