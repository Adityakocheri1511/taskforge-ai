# ==============================================================
# Frontend — build the SPA, then serve it with nginx.
# The final image contains no Node.js at all: just nginx and
# static files. That's ~50MB instead of ~1.1GB.
# ==============================================================

# ---------- Stage 1: build ----------
FROM node:20-alpine AS builder

WORKDIR /build

# Lockfile first — this layer caches until dependencies change
COPY package*.json ./
RUN npm ci

COPY . .

# Vite bakes VITE_* vars in at BUILD time, not runtime, so the
# API URLs must be known here. Compose passes them as build args.
ARG VITE_AUTH_URL
ARG VITE_TASK_URL
ARG VITE_AI_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL \
    VITE_TASK_URL=$VITE_TASK_URL \
    VITE_AI_URL=$VITE_AI_URL

RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine

COPY --from=builder /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]