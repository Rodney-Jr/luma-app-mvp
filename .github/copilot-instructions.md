<!--
Brief, actionable guidance for AI coding agents working on Luma MVP.
Keep this file small (~20-50 lines). Reference only discoverable facts.
-->
# Luma — AI assistant instructions

- Project layout: `backend/` (FastAPI app), `frontend/` (React + Vite), `deployment/` (docker/nginx scripts), `tests/`.
- Backend entry: `backend/app/main.py`. Routes under `backend/app/routes/` (counsellors, counselees, chatbot). DB helpers in `backend/app/utils/db.py`.

- Big picture: a lightweight FastAPI backend exposing REST endpoints for anonymous sessions and counsellor management. Data is persisted to a local SQLite DB (path from env `LUMA_DB_PATH` or `/data/luma.sqlite3`). Frontend (React + Vite) uses REST and socket clients (see `frontend/package.json` scripts).

- Dev/run commands (Windows PowerShell examples used by maintainers):

```powershell
# activate virtualenv then run backend (from repo root)
& .\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --app-dir backend

# frontend dev (from repo root)
cd frontend; npm run dev
```

- Key patterns and conventions:
  - DB: sqlite3, simple helper `get_db_conn()`; tables created in `init_db()` (called on app start). Store structured fields (categories, languages, meta) as JSON strings.
  - Routes return Pydantic models defined (look under `backend/app/models.py` and route-specific model aliases in route files). Example: `POST /api/counselees/session/start` returns `{ "session_id": "s-..." }` (see `routes/counselees.py`).
  - Counsellor records store `display_name`, `categories` (JSON array), `languages` (JSON array), `bio`, and `status` (`pending`/`approved`). Use the existing insert/select examples in `routes/counsellors.py` when adding features.
  - Chatbot: simple rule-based intents mapping in `routes/chatbot.py`. Keep new intents as static mapping unless explicitly integrating an external LLM.

- Testing and CI:
  - Backend tests use `pytest` + `fastapi.testclient`. Tests import the app from `backend/app/main.py` (see `tests/backend_tests.py`). Keep tests fast and avoid depending on external network services.
  - Dependencies: install backend requirements into the project's virtualenv before running tests:

```powershell
& .\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

  - If tests error during collection with a missing package (e.g., `httpx`), it's usually because pytest ran under a different Python interpreter than the project's `.venv`.

- Common pitfalls discovered in code:
  - Pydantic model definitions must use proper typing annotations. The repo contains minimal Pydantic models; avoid executing `models.py` as a script (it may raise type inference errors if malformed). Prefer using models through FastAPI import paths (e.g., `from backend.app.models import ...`).
  - DB path defaults to `/data/luma.sqlite3`. On Windows, ensure `LUMA_DB_PATH` points to a valid directory or the `os.makedirs` in `get_db_conn()` will attempt to create the parent directory of that path.

- Environment / Python:
  - Recommended Python: 3.8 - 3.11. This repository's dependencies (Pydantic v1 used by FastAPI) show compatibility warnings on Python 3.14.
  - If running into Pydantic type-inference errors or runtime warnings on newer Python (3.14+), either use a Python <=3.11 virtualenv, or upgrade dependencies and models to Pydantic v2 (larger change).

- When extending functionality, follow these concrete examples:
  - Adding a new session field: persist it as JSON in `sessions.meta`, and update `SessionCreateResponse` in `backend/app/models.py` and the route handler in `routes/counselees.py`.
  - Adding a counsellor search filter: follow the SQL + json.loads pattern used in `routes/counsellors.py` to deserialize `categories`/`languages`.

- If you need to run the app in dev with the same behavior as tests/CI, run the `init_db()` flow by importing `backend/app/main.py` or starting Uvicorn with `--app-dir backend` so package-relative imports resolve.

If any of these sections are unclear or you need examples for a change (new route, DB migration, or frontend integration), ask and include the target file path you want modified.
