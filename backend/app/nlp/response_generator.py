# Intelligent response generation for LumaBot
import random
from typing import Dict, List
from .sentiment_analyzer import SentimentAnalyzer

class ResponseGenerator:
    def __init__(self):
        self.sentiment_analyzer = SentimentAnalyzer()
        
        # Response templates based on sentiment and context
        self.responses = {
            "greeting": [
                "Hello! I'm LumaBot 🤖 I'm here to listen and help you connect with the right support.",
                "Hi there! I'm LumaBot, your compassionate AI assistant. How are you feeling today?",
                "Welcome! I'm LumaBot 🌟 I'm here to provide a safe space for you to share what's on your mind."
            ],
            
            "positive_sentiment": [
                "I'm glad to hear you're feeling positive! Even when things are going well, it's great to have support. How can I help you today?",
                "That's wonderful! It sounds like you're in a good place. Is there anything specific you'd like to talk about or explore?",
                "I love your positive energy! Sometimes we want to talk even when things are going well. What's on your mind?"
            ],
            
            "negative_sentiment": {
                "low": [
                    "I hear that you're going through something difficult. It takes courage to reach out, and I'm here to listen.",
                    "Thank you for sharing with me. It sounds like you're dealing with some challenges. You're not alone in this.",
                    "I can sense that things might be tough right now. I'm here to support you through this."
                ],
                "medium": [
                    "I can hear the pain in your words, and I want you to know that your feelings are completely valid.",
                    "It sounds like you're really struggling right now. I'm here to listen and help you find the support you need.",
                    "Thank you for trusting me with how you're feeling. You've taken an important step by reaching out."
                ],
                "high": [
                    "I can tell you're in a lot of pain right now, and I'm really glad you reached out. Your life has value and meaning.",
                    "What you're feeling sounds incredibly difficult. Please know that you don't have to go through this alone.",
                    "I hear how much you're hurting. Reaching out shows incredible strength, even when it doesn't feel that way."
                ]
            },
            
            "crisis_response": {
                "high": [
                    "🚨 I'm very concerned about what you've shared. Your safety is the most important thing right now. Please consider contacting a crisis helpline immediately: National Suicide Prevention Lifeline: 988. I'd also like to connect you with a counsellor right away.",
                    "🚨 What you're describing sounds like a crisis situation. Please reach out for immediate help: Call 988 (Suicide Prevention Lifeline) or text 'HELLO' to 741741 (Crisis Text Line). Let me also get you connected with emergency support here."
                ],
                "medium": [
                    "I'm concerned about what you're going through. While I'm here to listen, I think it would be really helpful to connect you with a trained counsellor who can provide more specialized support.",
                    "Thank you for sharing something so personal with me. I think you would benefit from talking to someone with professional training. Let me help you connect with a counsellor."
                ]
            },
            
            "category_responses": {
                "mental_health": [
                    "Mental health challenges are incredibly common, and seeking support shows real strength. I'd love to connect you with a counsellor who specializes in mental health support.",
                    "Thank you for sharing about your mental health. It's brave to reach out, and there are people here who understand what you're going through."
                ],
                "relationships": [
                    "Relationship challenges can be really difficult to navigate. Our counsellors who specialize in relationships and communication can offer valuable perspective.",
                    "Relationships are complex, and it's normal to need support working through challenges. Let me connect you with someone who can help."
                ],
                "academic": [
                    "Academic stress is something many people struggle with. Our counsellors can help you develop strategies for managing school-related challenges.",
                    "School and academic pressures can be overwhelming. You don't have to handle this alone - let me connect you with academic support."
                ],
                "career": [
                    "Career and work-related stress is very common. Our counsellors can help you navigate professional challenges and find balance.",
                    "Work challenges can really impact our wellbeing. Let me connect you with someone who specializes in career and workplace support."
                ],
                "family": [
                    "Family relationships can be complicated and emotionally challenging. Our counsellors understand family dynamics and can provide helpful guidance.",
                    "Family issues often require careful navigation. Let me connect you with a counsellor who specializes in family relationships."
                ]
            },
            
            "session_encouragement": [
                "Based on what you've shared, I think talking with one of our trained counsellors would be really beneficial. Would you like me to start an anonymous session for you?",
                "It sounds like you could really benefit from connecting with a human counsellor. They can provide the personalized support you deserve. Shall we get you connected?",
                "I think you're ready to take the next step and talk with a professional counsellor. They're trained to help with exactly what you're going through. Would you like to start a session?"
            ],
            
            "fallback": [
                "I want to make sure I understand what you're going through. Could you tell me a bit more about how you're feeling?",
                "Thank you for sharing with me. I'm here to listen and help connect you with the right support. What's been on your mind lately?",
                "I'm here to support you. Sometimes it helps to talk about what's been weighing on you. What would you like to share?"
            ]
        }
    
    def generate_response(self, user_message: str, conversation_history: List[Dict] = None) -> Dict:
        """Generate an intelligent response based on NLP analysis"""
        
        # Analyze the user's message
        sentiment_analysis = self.sentiment_analyzer.analyze_sentiment(user_message)
        crisis_analysis = self.sentiment_analyzer.detect_crisis_indicators(user_message)
        category = self.sentiment_analyzer.categorize_concern(user_message)
        keywords = self.sentiment_analyzer.extract_keywords(user_message)
        
        # Determine response strategy
        response_data = {
            "message": "",
            "sentiment": sentiment_analysis,
            "category": category,
            "crisis_level": crisis_analysis["risk_level"],
            "should_escalate": False,
            "suggested_actions": []
        }
        
        # Handle crisis situations first
        if crisis_analysis["has_crisis_indicators"]:
            if crisis_analysis["risk_level"] == "high":
                response_data["message"] = random.choice(self.responses["crisis_response"]["high"])
                response_data["should_escalate"] = True
                response_data["suggested_actions"] = ["immediate_crisis_support", "emergency_session"]
            elif crisis_analysis["risk_level"] == "medium":
                response_data["message"] = random.choice(self.responses["crisis_response"]["medium"])
                response_data["should_escalate"] = True
                response_data["suggested_actions"] = ["priority_session", "counsellor_match"]
            
            return response_data
        
        # Handle greetings
        if self._is_greeting(user_message):
            response_data["message"] = random.choice(self.responses["greeting"])
            response_data["suggested_actions"] = ["continue_conversation"]
            return response_data
        
        # Handle based on sentiment
        if sentiment_analysis["sentiment"] == "positive":
            response_data["message"] = random.choice(self.responses["positive_sentiment"])
            response_data["suggested_actions"] = ["explore_topics", "optional_session"]
            
        elif sentiment_analysis["sentiment"] == "negative":
            intensity = sentiment_analysis["intensity"]
            response_data["message"] = random.choice(self.responses["negative_sentiment"][intensity])
            
            if intensity == "high":
                response_data["suggested_actions"] = ["immediate_session", "counsellor_match"]
                response_data["should_escalate"] = True
            elif intensity == "medium":
                response_data["suggested_actions"] = ["recommended_session", "category_match"]
            else:
                response_data["suggested_actions"] = ["optional_session", "continue_conversation"]
        
        # Add category-specific response if applicable
        if category != "general" and category in self.responses["category_responses"]:
            category_response = random.choice(self.responses["category_responses"][category])
            response_data["message"] += f"\n\n{category_response}"
            response_data["suggested_actions"].append("category_specific_session")
        
        # Add session encouragement for certain conditions
        if (sentiment_analysis["intensity"] in ["medium", "high"] or 
            category != "general" or 
            len(keywords) > 3):
            
            encouragement = random.choice(self.responses["session_encouragement"])
            response_data["message"] += f"\n\n{encouragement}"
            response_data["suggested_actions"].append("session_prompt")
        
        # Fallback if no specific response generated
        if not response_data["message"]:
            response_data["message"] = random.choice(self.responses["fallback"])
            response_data["suggested_actions"] = ["continue_conversation"]
        
        return response_data
    
    def _is_greeting(self, message: str) -> bool:
        """Check if the message is a greeting"""
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
        message_lower = message.lower().strip()
        
        # Check for exact matches or if message starts with greeting
        for greeting in greetings:
            if message_lower == greeting or message_lower.startswith(greeting):
                return True
        
        return False
    
    def get_follow_up_questions(self, category: str) -> List[str]:
        """Get follow-up questions based on the identified category"""
        questions = {
            "mental_health": [
                "How long have you been feeling this way?",
                "Have you been able to talk to anyone about this before?",
                "What does a typical day look like for you right now?"
            ],
            "relationships": [
                "How long has this relationship challenge been going on?",
                "Have you been able to communicate about this with the other person?",
                "What would an ideal resolution look like for you?"
            ],
            "academic": [
                "What specific academic challenges are you facing?",
                "How is this affecting other areas of your life?",
                "What support systems do you currently have at school?"
            ],
            "career": [
                "How long have you been dealing with this work situation?",
                "What aspects of your job are most challenging right now?",
                "Have you considered what changes might help?"
            ],
            "family": [
                "How long has this family situation been affecting you?",
                "Are there other family members you can talk to about this?",
                "What would you most like to see change in your family dynamic?"
            ]
        }
        
        return questions.get(category, [
            "What's been weighing on your mind the most?",
            "How has this been affecting your daily life?",
            "What kind of support do you think would be most helpful?"
        ])