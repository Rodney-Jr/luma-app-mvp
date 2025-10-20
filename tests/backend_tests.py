import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_start_session():
    r = client.post("/api/counselees/session/start")
    assert r.status_code == 200
    assert "session_id" in r.json()
