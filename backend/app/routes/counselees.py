# Routes for anonymous counselees
from fastapi import APIRouter
from ..utils.db import get_db_conn
from ..models import SessionCreateResponse
import secrets, json, time

router = APIRouter()

@router.post("/session/start", response_model=SessionCreateResponse)
def start_session():
    # create ephemeral session id
    rand = secrets.token_urlsafe(8)
    session_id = f"s-{int(time.time())}-{rand}"
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO sessions(session_id,created_at,meta) VALUES (?,?,?)", (session_id, int(time.time()), json.dumps({})))
    conn.commit()
    conn.close()
    return SessionCreateResponse(session_id=session_id)

@router.get("/session/{session_id}")
def get_session(session_id: str):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT session_id, created_at FROM sessions WHERE session_id=?", (session_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return {"found": False}
    return {"found": True, "session_id": row[0], "created_at": row[1]}

@router.post("/session/{session_id}/message")
def send_message(session_id: str, payload: dict):
    conn = get_db_conn()
    cur = conn.cursor()
    # Verify session exists
    cur.execute("SELECT id FROM sessions WHERE session_id=?", (session_id,))
    if not cur.fetchone():
        conn.close()
        return {"error": "Session not found"}
    
    # Store message
    cur.execute(
        "INSERT INTO messages(session_id, sender, message) VALUES (?,?,?)",
        (session_id, "counselee", payload.get("message", ""))
    )
    conn.commit()
    conn.close()
    return {"status": "sent"}

@router.get("/session/{session_id}/messages")
def get_messages(session_id: str):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT sender, message, ts FROM messages WHERE session_id=? ORDER BY ts ASC",
        (session_id,)
    )
    rows = cur.fetchall()
    conn.close()
    
    messages = []
    for row in rows:
        messages.append({
            "sender": row[0],
            "message": row[1],
            "timestamp": row[2]
        })
    return {"messages": messages}
