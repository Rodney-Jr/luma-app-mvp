# Routes for counsellor registration and listing
from fastapi import APIRouter, HTTPException
from ..utils.db import get_db_conn
from ..models import CounsellorCreate, Counsellor
import json, time

router = APIRouter()

@router.post("/register", response_model=Counsellor)
def register_counsellor(payload: CounsellorCreate):
    conn = get_db_conn()
    cur = conn.cursor()
    # Insert with default status 'pending'
    cur.execute(
        "INSERT INTO counsellors(display_name,categories,languages,bio,status) VALUES (?,?,?,?,?)",
        (payload.display_name, json.dumps(payload.categories), json.dumps(payload.languages), payload.bio or "", "pending")
    )
    conn.commit()
    cid = cur.lastrowid
    cur.execute("SELECT id,display_name,categories,languages,bio,status FROM counsellors WHERE id=?", (cid,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=500, detail="Failed to register")
    return Counsellor(
        id=row[0],
        display_name=row[1],
        categories=json.loads(row[2]),
        languages=json.loads(row[3]),
        bio=row[4],
        status=row[5]
    )

@router.get("/", response_model=list[Counsellor])
def list_counsellors(status: str = "approved"):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT id,display_name,categories,languages,bio,status FROM counsellors WHERE status=?", (status,))
    rows = cur.fetchall()
    conn.close()
    out = []
    for r in rows:
        out.append(Counsellor(
            id=r[0],
            display_name=r[1],
            categories=json.loads(r[2]),
            languages=json.loads(r[3]),
            bio=r[4],
            status=r[5]
        ))
    return out

@router.get("/sessions/available")
def get_available_sessions():
    """Get sessions waiting for counsellors"""
    conn = get_db_conn()
    cur = conn.cursor()
    # Get sessions that don't have an assigned counsellor yet
    cur.execute("""
        SELECT s.session_id, s.created_at, s.meta 
        FROM sessions s 
        LEFT JOIN session_assignments sa ON s.session_id = sa.session_id 
        WHERE sa.session_id IS NULL 
        ORDER BY s.created_at ASC
    """)
    rows = cur.fetchall()
    conn.close()
    
    sessions = []
    for row in rows:
        meta = json.loads(row[2]) if row[2] else {}
        sessions.append({
            "session_id": row[0],
            "created_at": row[1],
            "category": meta.get("category", "General"),
            "waiting_time": int(time.time()) - row[1]
        })
    return {"sessions": sessions}

@router.post("/sessions/{session_id}/accept")
def accept_session(session_id: str, counsellor_id: int):
    """Assign a counsellor to a session"""
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Check if session exists and is not already assigned
    cur.execute("SELECT id FROM sessions WHERE session_id=?", (session_id,))
    if not cur.fetchone():
        conn.close()
        return {"error": "Session not found"}
    
    # Create assignment table if it doesn't exist
    cur.execute("""
        CREATE TABLE IF NOT EXISTS session_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE,
            counsellor_id INTEGER,
            assigned_at INTEGER DEFAULT (strftime('%s','now'))
        )
    """)
    
    # Assign counsellor to session
    try:
        cur.execute(
            "INSERT INTO session_assignments(session_id, counsellor_id) VALUES (?,?)",
            (session_id, counsellor_id)
        )
        conn.commit()
        conn.close()
        return {"status": "accepted", "session_id": session_id}
    except:
        conn.close()
        return {"error": "Session already assigned"}
