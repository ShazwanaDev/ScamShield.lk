# ScamShield LK — Backend

Flask API for message classification and community scam reporting. Schema follows
the ERD in `Academic/Diagrams/ERD Final Project.drawio.png` (Users, ScamCategories,
ModelVersions, ClassifiedMessages, ScamReports).

## Database

Schema changes are managed with **Flask-Migrate / Alembic** — there is no more
implicit `db.create_all()` on boot. `migrations/` is committed to the repo; only
the database *contents* differ per environment.

### Local setup (Postgres via Docker)

```bash
docker compose up -d postgres redis
cd backend
python -m venv venv && source venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt

export DATABASE_URL=postgresql://scamshield:scamshield@localhost:5432/scamshield
flask --app app db upgrade      # applies migrations/versions/*.py
python -m scripts.seed          # seeds scam_categories + a default model_version
flask --app app run --debug
```

### Making a schema change

1. Edit the models in `models/db.py`.
2. Generate a migration: `flask --app app db migrate -m "describe the change"`.
3. **Read the generated file in `migrations/versions/`** — autogenerate misses
   some renames/constraints and needs manual correction.
4. Apply it locally: `flask --app app db upgrade`.
5. Commit the migration file alongside the model change.

### Docker / production

`entrypoint.sh` runs automatically on container start: it waits for Postgres to
accept connections, runs `flask db upgrade`, then runs `scripts/seed.py` (both are
idempotent — safe to re-run on every deploy) before handing off to gunicorn.

### Seed data

`scripts/seed.py` populates:
- `scam_categories` — the 9-category taxonomy also used by `web/src/data/scamCategories.js`
  and `web/src/lib/api.js` (`REPORT_CATEGORIES`). Required for `/api/submit-sms` category
  lookups to resolve — without it, every report is saved with `category_id = NULL`.
- `model_versions` — one `is_active=True` row, so `/api/predict` has a model version to
  stamp classifications with.

## Known limitations

- `ml/models/*.pkl` (the trained vectorizer + classifier) aren't in this repo — `/api/predict`
  will 500 until they're trained and placed there.
- `ScamReport.predicted_label` / `confirmed_label` exist in the schema (per the ERD) but
  nothing currently writes to them — the report submission API doesn't accept a predicted
  label, and the moderation endpoint doesn't set a confirmed one. Wiring that up is an API
  change, not a schema one.
- `User` has no auth fields (only `device_id`/`platform`) — anonymous/device-identified
  usage only, matching the current mobile app's offline-first design.
