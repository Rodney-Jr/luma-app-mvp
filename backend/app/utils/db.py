# Database connection utility placeholder
import sqlite3
import os

DB_PATH = os.environ.get("LUMA_DB_PATH", "/data/luma.sqlite3")

def get_db_conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    return conn

def init_db():
    conn = get_db_conn()
    cur = conn.cursor()
    # counsellors: store categories/languages as JSON strings
    cur.execute("""
    CREATE TABLE IF NOT EXISTS counsellors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        display_name TEXT NOT NULL,
        categories TEXT,
        languages TEXT,
        bio TEXT,
        status TEXT,
        created_at INTEGER DEFAULT (strftime('%s','now'))
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE,
        created_at INTEGER,
        meta TEXT
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        sender TEXT,
        message TEXT,
        ts INTEGER DEFAULT (strftime('%s','now'))
    )
    """)
    conn.commit()
    conn.close()

