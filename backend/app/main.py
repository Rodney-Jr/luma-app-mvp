# Entry point for FastAPI backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import counsellors, counselees, chatbot
from .utils.db import init_db

app = FastAPI(title="Luma Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize DB (creates tables if missing)
init_db()

# include routers
app.include_router(counsellors.router, prefix="/api/counsellors", tags=["counsellors"])
app.include_router(counselees.router, prefix="/api/counselees", tags=["counselees"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "luma-backend"}
