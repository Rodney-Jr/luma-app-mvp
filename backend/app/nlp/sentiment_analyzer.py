# NLP utilities for sentiment analysis and text processing
import re
import nltk
from textblob import TextBlob
from typing import Dict, List, Tuple
import json

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger', quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

class SentimentAnalyzer:
    def __init__(self):
        self.stemmer = PorterStemmer()
        try:
            self.stop_words = set(stopwords.words('english'))
        except:
            self.stop_words = set()
    
    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of the given text"""
        blob = TextBlob(text)
        
        # Get polarity (-1 to 1) and subjectivity (0 to 1)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        # Classify sentiment
        if polarity > 0.1:
            sentiment = "positive"
        elif polarity < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        # Determine emotional intensity
        intensity = abs(polarity)
        if intensity > 0.6:
            intensity_level = "high"
        elif intensity > 0.3:
            intensity_level = "medium"
        else:
            intensity_level = "low"
        
        return {
            "sentiment": sentiment,
            "polarity": polarity,
            "subjectivity": subjectivity,
            "intensity": intensity_level,
            "confidence": intensity
        }
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from text"""
        # Clean and tokenize
        text = re.sub(r'[^\w\s]', '', text.lower())
        tokens = word_tokenize(text)
        
        # Remove stopwords and stem
        keywords = []
        for token in tokens:
            if token not in self.stop_words and len(token) > 2:
                stemmed = self.stemmer.stem(token)
                keywords.append(stemmed)
        
        return list(set(keywords))  # Remove duplicates
    
    def detect_crisis_indicators(self, text: str) -> Dict:
        """Detect potential crisis or urgent help indicators"""
        crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
            'want to die', 'no point', 'hopeless', 'worthless', 'emergency',
            'crisis', 'urgent', 'immediate help', 'can\'t go on', 'give up'
        ]
        
        text_lower = text.lower()
        detected_indicators = []
        
        for indicator in crisis_keywords:
            if indicator in text_lower:
                detected_indicators.append(indicator)
        
        risk_level = "low"
        if len(detected_indicators) > 0:
            if any(word in text_lower for word in ['suicide', 'kill myself', 'want to die', 'end it all']):
                risk_level = "high"
            elif len(detected_indicators) >= 2:
                risk_level = "medium"
            else:
                risk_level = "low"
        
        return {
            "has_crisis_indicators": len(detected_indicators) > 0,
            "indicators": detected_indicators,
            "risk_level": risk_level
        }
    
    def categorize_concern(self, text: str) -> str:
        """Categorize the type of concern based on keywords"""
        categories = {
            "mental_health": [
                'anxiety', 'depression', 'stress', 'panic', 'worried', 'sad',
                'overwhelmed', 'mental health', 'therapy', 'counseling', 'mood'
            ],
            "relationships": [
                'relationship', 'partner', 'boyfriend', 'girlfriend', 'marriage',
                'divorce', 'breakup', 'family', 'friends', 'love', 'dating'
            ],
            "academic": [
                'school', 'college', 'university', 'grades', 'exam', 'study',
                'homework', 'academic', 'education', 'learning', 'student'
            ],
            "career": [
                'job', 'work', 'career', 'employment', 'boss', 'workplace',
                'interview', 'resume', 'professional', 'office', 'salary'
            ],
            "family": [
                'parents', 'mother', 'father', 'siblings', 'children', 'family',
                'home', 'household', 'domestic', 'parenting'
            ]
        }
        
        text_lower = text.lower()
        category_scores = {}
        
        for category, keywords in categories.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            return max(category_scores, key=category_scores.get)
        else:
            return "general"