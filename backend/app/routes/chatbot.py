# Enhanced NLP-powered chatbot route with performance optimization
from fastapi import APIRouter, HTTPException, BackgroundTasks
from ..models import BotQuery
from typing import Dict, List, Optional
import logging
import asyncio
import time
from functools import lru_cache
import hashlib

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Global variables for lazy loading
response_generator = None
sentiment_analyzer = None
nlp_loading = False
response_cache = {}

# Fast response templates for immediate replies
QUICK_RESPONSES = {
    "greeting": [
        "Hi! I'm LumaBot 🤖 I'm here to listen and help. What's on your mind?",
        "Hello! I'm LumaBot, your AI companion. How are you feeling today?",
        "Hey there! I'm LumaBot 🌟 I'm here to support you. What would you like to talk about?"
    ],
    "mental_health": [
        "I hear you're dealing with something difficult. Mental health challenges are real and valid. I'm here to listen and help connect you with support.",
        "Thank you for sharing about your mental health. It takes courage to reach out. Let me help you find the right support."
    ],
    "crisis": [
        "🚨 I'm very concerned about what you've shared. Please reach out for immediate help: Call 988 (Suicide Prevention Lifeline) or text 'HELLO' to 741741. Let me also connect you with emergency support here.",
        "🚨 Your safety is the most important thing. Please contact crisis support immediately: 988 or text 741741. I'm also here to help connect you with a counsellor right away."
    ],
    "positive": [
        "I'm glad you're reaching out! Even when things are going well, it's great to have support. How can I help you today?",
        "That's wonderful to hear! What would you like to explore or talk about?"
    ],
    "help": [
        "I'm here to help connect you with volunteer counsellors who specialize in mental health, relationships, academics, and more. What's been on your mind?",
        "I can help you find the right support for whatever you're going through. Tell me a bit about your situation."
    ],
    "session": [
        "I think talking with one of our trained counsellors would be really beneficial. Would you like me to start an anonymous session for you?",
        "Based on what you've shared, connecting with a professional counsellor sounds like a great next step. Shall we get you connected?"
    ],
    "default": [
        "Thank you for sharing with me. I'm here to listen and help you find the right support. Could you tell me more about how you're feeling?",
        "I'm here to support you. What's been weighing on your mind lately?",
        "I want to make sure I understand what you're going through. Could you tell me a bit more?"
    ]
}

async def load_nlp_components():
    """Load NLP components asynchronously"""
    global response_generator, sentiment_analyzer, nlp_loading
    
    if response_generator and sentiment_analyzer:
        return True
    
    if nlp_loading:
        return False
    
    nlp_loading = True
    try:
        from ..nlp.response_generator import ResponseGenerator
        from ..nlp.sentiment_analyzer import SentimentAnalyzer
        
        response_generator = ResponseGenerator()
        sentiment_analyzer = SentimentAnalyzer()
        logger.info("NLP components loaded successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to load NLP components: {e}")
        return False
    finally:
        nlp_loading = False

@lru_cache(maxsize=100)
def get_cached_response_key(message: str) -> str:
    """Generate cache key for message"""
    return hashlib.md5(message.lower().strip().encode()).hexdigest()

def get_quick_response(message: str) -> Dict:
    """Provide fast response using pattern matching"""
    import random
    
    message_lower = message.lower().strip()
    
    # Crisis detection (high priority)
    crisis_keywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'want to die', 'no point']
    if any(keyword in message_lower for keyword in crisis_keywords):
        return {
            "reply": random.choice(QUICK_RESPONSES["crisis"]),
            "sentiment": {"sentiment": "negative", "confidence": 0.9, "intensity": "high"},
            "category": "mental_health",
            "crisis_level": "high",
            "should_escalate": True,
            "suggested_actions": ["immediate_crisis_support", "emergency_session"],
            "nlp_available": False,
            "response_time": "fast"
        }
    
    # Greetings
    if any(greeting in message_lower for greeting in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
        return {
            "reply": random.choice(QUICK_RESPONSES["greeting"]),
            "sentiment": {"sentiment": "neutral", "confidence": 0.7},
            "category": "general",
            "crisis_level": "low",
            "should_escalate": False,
            "suggested_actions": ["continue_conversation"],
            "nlp_available": False,
            "response_time": "fast"
        }
    
    # Mental health keywords
    mental_keywords = ['anxiety', 'depression', 'stress', 'panic', 'worried', 'sad', 'overwhelmed']
    if any(keyword in message_lower for keyword in mental_keywords):
        return {
            "reply": random.choice(QUICK_RESPONSES["mental_health"]) + "\n\n" + random.choice(QUICK_RESPONSES["session"]),
            "sentiment": {"sentiment": "negative", "confidence": 0.8, "intensity": "medium"},
            "category": "mental_health",
            "crisis_level": "medium",
            "should_escalate": False,
            "suggested_actions": ["recommended_session", "category_match"],
            "nlp_available": False,
            "response_time": "fast"
        }
    
    # Positive sentiment
    positive_keywords = ['good', 'great', 'happy', 'fine', 'okay', 'well', 'better']
    if any(keyword in message_lower for keyword in positive_keywords):
        return {
            "reply": random.choice(QUICK_RESPONSES["positive"]),
            "sentiment": {"sentiment": "positive", "confidence": 0.7},
            "category": "general",
            "crisis_level": "low",
            "should_escalate": False,
            "suggested_actions": ["explore_topics", "optional_session"],
            "nlp_available": False,
            "response_time": "fast"
        }
    
    # Help requests
    if any(word in message_lower for word in ['help', 'support', 'assistance', 'need']):
        return {
            "reply": random.choice(QUICK_RESPONSES["help"]),
            "sentiment": {"sentiment": "neutral", "confidence": 0.6},
            "category": "general",
            "crisis_level": "low",
            "should_escalate": False,
            "suggested_actions": ["continue_conversation", "optional_session"],
            "nlp_available": False,
            "response_time": "fast"
        }
    
    # Default response
    return {
        "reply": random.choice(QUICK_RESPONSES["default"]),
        "sentiment": {"sentiment": "neutral", "confidence": 0.5},
        "category": "general",
        "crisis_level": "low",
        "should_escalate": False,
        "suggested_actions": ["continue_conversation"],
        "nlp_available": False,
        "response_time": "fast"
    }

@router.post("/query")
async def query_bot(payload: BotQuery, background_tasks: BackgroundTasks):
    """Fast chatbot with optional NLP enhancement"""
    start_time = time.time()
    
    try:
        user_message = payload.message or ""
        
        if not user_message.strip():
            return {
                "reply": "I'm here to listen. What would you like to talk about?",
                "sentiment": {"sentiment": "neutral", "confidence": 0.5},
                "category": "general",
                "crisis_level": "low",
                "should_escalate": False,
                "suggested_actions": ["continue_conversation"],
                "response_time": "instant"
            }
        
        # Check cache first
        cache_key = get_cached_response_key(user_message)
        if cache_key in response_cache:
            cached_response = response_cache[cache_key].copy()
            cached_response["response_time"] = "cached"
            return cached_response
        
        # Always provide fast response first
        quick_response = get_quick_response(user_message)
        
        # Try to use NLP if available, but don't wait for it
        if response_generator and sentiment_analyzer:
            try:
                # Set a timeout for NLP processing
                nlp_start = time.time()
                response_data = response_generator.generate_response(user_message)
                nlp_time = time.time() - nlp_start
                
                if nlp_time < 2.0:  # Only use NLP if it's fast enough
                    response_data.update({
                        "reply": response_data["message"],
                        "nlp_available": True,
                        "keywords": sentiment_analyzer.extract_keywords(user_message),
                        "response_time": f"nlp_{nlp_time:.2f}s"
                    })
                    
                    # Cache the response
                    response_cache[cache_key] = response_data.copy()
                    if len(response_cache) > 100:  # Limit cache size
                        response_cache.clear()
                    
                    return response_data
                else:
                    logger.warning(f"NLP too slow ({nlp_time:.2f}s), using quick response")
                    
            except Exception as e:
                logger.error(f"NLP processing failed: {e}")
        
        # Load NLP in background for future requests
        if not response_generator or not sentiment_analyzer:
            background_tasks.add_task(load_nlp_components)
        
        # Cache and return quick response
        response_cache[cache_key] = quick_response.copy()
        if len(response_cache) > 100:
            response_cache.clear()
        
        response_time = time.time() - start_time
        quick_response["response_time"] = f"fast_{response_time:.3f}s"
        
        return quick_response
            
    except Exception as e:
        logger.error(f"Chatbot query failed: {e}")
        return {
            "reply": "I'm having a brief technical issue, but I'm still here to help! What would you like to talk about?",
            "sentiment": {"sentiment": "neutral", "confidence": 0.5},
            "category": "general",
            "crisis_level": "low",
            "should_escalate": False,
            "suggested_actions": ["continue_conversation"],
            "response_time": "error_fallback"
        }

@router.get("/health")
def chatbot_health():
    """Health check for chatbot service"""
    nlp_status = "available" if (response_generator and sentiment_analyzer) else "unavailable"
    return {
        "status": "ok",
        "nlp_status": nlp_status,
        "features": {
            "sentiment_analysis": nlp_status == "available",
            "crisis_detection": nlp_status == "available",
            "category_classification": nlp_status == "available",
            "intelligent_responses": nlp_status == "available"
        }
    }

@router.post("/analyze")
def analyze_text(payload: BotQuery):
    """Endpoint for detailed text analysis (for debugging/monitoring)"""
    if not (response_generator and sentiment_analyzer):
        raise HTTPException(status_code=503, detail="NLP services unavailable")
    
    try:
        user_message = payload.message or ""
        
        sentiment = sentiment_analyzer.analyze_sentiment(user_message)
        crisis = sentiment_analyzer.detect_crisis_indicators(user_message)
        category = sentiment_analyzer.categorize_concern(user_message)
        keywords = sentiment_analyzer.extract_keywords(user_message)
        
        return {
            "message": user_message,
            "sentiment_analysis": sentiment,
            "crisis_analysis": crisis,
            "category": category,
            "keywords": keywords,
            "analysis_timestamp": "now"
        }
        
    except Exception as e:
        logger.error(f"Text analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Analysis service temporarily unavailable")
