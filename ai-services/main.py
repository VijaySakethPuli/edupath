from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
from models.aptitude import AptitudeEngine
from models.recommender import CareerRecommendationEngine
from models.personality import PersonalityAnalyzer
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EduPathAI ML Services", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
aptitude_engine = AptitudeEngine()
career_recommender = CareerRecommendationEngine()
personality_analyzer = PersonalityAnalyzer()

# Pydantic models
class InterestProfile(BaseModel):
    realistic: float
    investigative: float
    artistic: float
    social: float
    enterprising: float
    conventional: float

class AptitudeScores(BaseModel):
    logical: float
    numerical: float
    spatial: float
    verbal: float

class PersonalityTraits(BaseModel):
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

class StudentProfile(BaseModel):
    interests: InterestProfile
    aptitude: Optional[AptitudeScores] = None
    personality: Optional[PersonalityTraits] = None
    class_level: int
    location: Optional[Dict] = None
    constraints: Optional[Dict] = None

class RecommendationRequest(BaseModel):
    profile: StudentProfile
    recommendation_type: str = "career"  # "career", "stream", "college"

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "EduPathAI ML Services"}

@app.post("/analyze/interests")
async def analyze_interests(responses: List[Dict]):
    """Analyze interest assessment responses and return RIASEC profile"""
    try:
        profile = {}
        categories = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"]
        
        # Group responses by category
        category_scores = {cat: [] for cat in categories}
        for response in responses:
            category_scores[response["category"]].append(response["rating"])
        
        # Calculate average scores
        for category, scores in category_scores.items():
            if scores:
                profile[category] = sum(scores) / len(scores)
            else:
                profile[category] = 0
        
        # Normalize to 0-100 scale
        max_score = max(profile.values()) if profile.values() else 1
        for category in profile:
            profile[category] = (profile[category] / max_score) * 100
        
        return {
            "profile": profile,
            "primary_interests": sorted(profile.items(), key=lambda x: x, reverse=True)[:3],
            "interpretation": personality_analyzer.interpret_interests(profile)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assess/aptitude/next-question")
async def get_next_aptitude_question(current_performance: Dict):
    """Get next question for adaptive aptitude test"""
    try:
        question = aptitude_engine.get_next_question(
            previous_answers=current_performance.get("answers", []),
            current_difficulty=current_performance.get("difficulty", 3)
        )
        return question
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assess/aptitude/score")
async def score_aptitude_test(responses: List[Dict]):
    """Score completed aptitude assessment"""
    try:
        scores = aptitude_engine.calculate_scores(responses)
        return {
            "scores": scores,
            "interpretation": aptitude_engine.interpret_scores(scores),
            "strengths": aptitude_engine.identify_strengths(scores)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/careers")
async def recommend_careers(request: RecommendationRequest):
    """Generate career recommendations based on student profile"""
    try:
        recommendations = career_recommender.recommend_careers(
            interests=request.profile.interests.dict(),
            aptitude=request.profile.aptitude.dict() if request.profile.aptitude else None,
            personality=request.profile.personality.dict() if request.profile.personality else None,
            class_level=request.profile.class_level
        )
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/streams")
async def recommend_streams(request: RecommendationRequest):
    """Recommend academic streams based on profile"""
    try:
        stream_recommendations = career_recommender.recommend_streams(
            interests=request.profile.interests.dict(),
            aptitude=request.profile.aptitude.dict() if request.profile.aptitude else None,
            class_level=request.profile.class_level
        )
        return {"recommendations": stream_recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)