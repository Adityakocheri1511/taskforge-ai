#!/bin/bash
# Runs once on first Postgres startup (empty data volume only).
# Creates the Task service's database so no manual step is needed.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE taskforge_tasks;
EOSQL

echo "Created database: taskforge_tasks"