from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import json
from datetime import datetime
import subprocess
import asyncio
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pet AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModerationRequest(BaseModel):
    content: str
    pet_type: str = "general"
    user_id: Optional[str] = None

class AdviceRequest(BaseModel):
    question: str
    pet_type: str = "general"
    context: Optional[str] = None

class MatchRequest(BaseModel):
    user_id: str
    preferences: dict

# Mock AI responses for demo (replace with actual llama.cpp in production)
class MockAI:
    @staticmethod
    def moderate(content: str, pet_type: str) -> dict:
        """Simulate AI moderation with rule-based scoring"""
        content_lower = content.lower()
        
        # Rule-based scoring
        toxicity = 0.0
        spam = 0.0
        advice_risk = 0.0
        flags = []
        reasoning = ""
        
        # Toxicity detection
        toxic_words = ['hate', 'stupid', 'idiot', 'kill', 'die']
        if any(word in content_lower for word in toxic_words):
            toxicity = 0.7
            flags.append("hate_speech")
            reasoning = "Contains potentially toxic language"
        
        # Spam detection
        spam_indicators = ['buy now', 'cheap', 'discount', 'www.', 'http://']
        if any(indicator in content_lower for indicator in spam_indicators):
            spam = 0.8
            flags.append("commercial_spam")
            reasoning = "Contains commercial spam indicators"
        
        # Medical advice risk
        medical_terms = ['medicine', 'drug', 'vaccine', 'treat at home', 'don\'t go to vet']
        if any(term in content_lower for term in medical_terms):
            advice_risk = 0.9
            flags.append("medical_advice")
            reasoning = "Contains unverified medical advice"
        
        # Chocolate example (for demo)
        if 'chocolate' in content_lower and ('fine' in content_lower or 'ok' in content_lower):
            advice_risk = 0.95
            flags.append("dangerous_advice")
            reasoning = "Downplaying dangerous food consumption"
        
        return {
            "toxicity": round(toxicity, 2),
            "spam": round(spam, 2),
            "advice_risk": round(advice_risk, 2),
            "reasoning": reasoning or "Content appears safe",
            "flags": flags,
            "model": "mock-mistral-7b"
        }
    
    @staticmethod
    def get_advice(question: str, pet_type: str) -> dict:
        """Simulate AI advice generation"""
        responses = {
            "dog": "Dogs typically need 30 minutes to 2 hours of exercise daily. Puppies require more frequent, shorter walks. Always use a leash in public areas and provide fresh water.",
            "cat": "Cats need mental stimulation. Provide scratching posts, interactive toys, and vertical spaces. Most cats prefer multiple small meals throughout the day.",
            "general": "All pets need fresh water, balanced nutrition, regular vet checkups, and a safe environment. Monitor for changes in behavior or appetite."
        }
        
        advice = responses.get(pet_type, responses["general"])
        
        return {
            "advice": f"⚠️ I'm an AI, not a vet. For emergencies, contact a professional.\n\n{advice}",
            "disclaimer": "This is general information only. Consult a veterinarian for specific advice.",
            "model": "mock-mistral-7b"
        }

@app.post("/moderate")
async def moderate_content(request: ModerationRequest):
    """AI moderation endpoint"""
    try:
        result = MockAI.moderate(request.content, request.pet_type)
        
        # For demo: simulate processing delay
        await asyncio.sleep(0.5)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/advice")
async def get_advice(request: AdviceRequest):
    """AI advice endpoint"""
    try:
        result = MockAI.get_advice(request.question, request.pet_type)
        await asyncio.sleep(1)  # Simulate LLM generation time
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match")
async def match_pets(request: MatchRequest):
    """Pet matching endpoint (placeholder)"""
    return {
        "matches": [],
        "status": "Feature coming soon"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "pet-ai-service",
        "timestamp": datetime.utcnow().isoformat(),
        "model": "mock-mistral-7b"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)