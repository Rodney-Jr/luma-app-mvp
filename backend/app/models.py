# backend/app/models.py
from pydantic import BaseModel
from typing import Optional, List

# --- Models used by routes ---
class CounsellorCreate(BaseModel):
    display_name: str
    categories: List[str]
    languages: List[str]
    bio: Optional[str] = None


class Counsellor(BaseModel):
    id: Optional[int] = None
    display_name: str
    categories: List[str]
    languages: List[str]
    bio: Optional[str] = None
    status: Optional[str] = None


class SessionCreateResponse(BaseModel):
    session_id: str


class BotQuery(BaseModel):
    message: Optional[str] = None
    conversation_history: Optional[List[dict]] = None
    session_id: Optional[str] = None

class BotResponse(BaseModel):
    reply: str
    sentiment: dict
    category: str
    crisis_level: str
    should_escalate: bool
    suggested_actions: List[str]
    nlp_available: Optional[bool] = True
    keywords: Optional[List[str]] = None


# Backwards-compatible simple models (if used elsewhere)
class Counselee(BaseModel):
    id: Optional[int] = None
    name: str
    issue: str
    email: Optional[str] = None


class ChatMessage(BaseModel):
    sender: str
    message: str
