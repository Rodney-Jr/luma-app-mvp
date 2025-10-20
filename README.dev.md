# Luma — Developer Quick Start

This file contains developer-focused quick start steps (expanded) so contributors can run the app locally.

Backend (PowerShell, run from repo root):

```powershell
& .\.venv\Scripts\Activate.ps1
# run backend (ensure --app-dir points to backend so package imports resolve)
uvicorn app.main:app --reload --app-dir backend
```

On Windows the default DB path (/data/luma.sqlite3) may not be writable. Set `LUMA_DB_PATH` to a local path and ensure the parent directory exists:

```powershell
$env:LUMA_DB_PATH = "C:\\Users\\LENOVO\\Desktop\\luma-app-mvp\\data\\luma.sqlite3"
mkdir -Force (Split-Path $env:LUMA_DB_PATH)
```

Frontend (from repo root):

```powershell
cd frontend
npm run dev
```

Run tests (from repo root):

```powershell
& .\.venv\Scripts\Activate.ps1
pytest -q
```

Install backend dependencies into the venv before running the server or tests:

```powershell
& .\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

For agent guidance, see `.github/copilot-instructions.md`.