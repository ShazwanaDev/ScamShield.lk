#!/bin/sh
# Runs before every container start: waits for Postgres to accept connections,
# applies pending Alembic migrations, seeds reference data (scam categories +
# default model version), then hands off to gunicorn. Replaces the old
# db.create_all() call that used to run inline in app.py on every boot.
set -e

python - <<'PY'
import os
import time
import sys
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

url = os.environ.get("DATABASE_URL", "postgresql://scamshield:scamshield@localhost:5432/scamshield")
engine = create_engine(url)

for attempt in range(1, 31):
    try:
        with engine.connect():
            print("Database is ready.")
            sys.exit(0)
    except OperationalError:
        print(f"Waiting for database... ({attempt}/30)")
        time.sleep(2)

print("Database never became ready; exiting.")
sys.exit(1)
PY

flask --app app db upgrade
python -m scripts.seed

exec "$@"
