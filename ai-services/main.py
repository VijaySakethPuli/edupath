from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional

# Third-party / internal libs
import numpy as np  # if engines use it
from dotenv import load_dotenv

# Your internal models
from models.aptitude import AptitudeEngine
from models.recommender import CareerRecommendationEngine
from models.personality import PersonalityAnalyzer

load_dotenv()

# -----------------------------------------------------------------------------
# App and CORS
# -----------------------------------------------------------------------------
app = FastAPI(docs_url="/docs", redoc_url="/redoc", openapi_url="/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Version / health
# -----------------------------------------------------------------------------
@app.get("/version")
def version():
    return {"ok": True, "service": "EduPathAI ML", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "EduPathAI ML Services"}

# -----------------------------------------------------------------------------
# Initialize ML engines
# -----------------------------------------------------------------------------
aptitude_engine = AptitudeEngine()
career_recommender = CareerRecommendationEngine()
personality_analyzer = PersonalityAnalyzer()

# -----------------------------------------------------------------------------
# Pydantic schemas (rich)
# -----------------------------------------------------------------------------
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

# -----------------------------------------------------------------------------
# Interests analysis
# -----------------------------------------------------------------------------
@app.post("/analyze/interests")
async def analyze_interests(responses: List[Dict]):
    """
    Analyze interest assessment responses and return RIASEC-like profile.
    Each response: {"category": one of categories, "rating": 1..5}
    """
    try:
        profile: Dict[str, float] = {}
        categories = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"]

        # Group ratings by category
        category_scores: Dict[str, List[float]] = {cat: [] for cat in categories}
        for r in responses:
            cat = r.get("category")
            rating = r.get("rating")
            if cat in category_scores and isinstance(rating, (int, float)):
                category_scores[cat].append(float(rating))

        # Averages
        for cat, scores in category_scores.items():
            profile[cat] = (sum(scores) / len(scores)) if scores else 0.0

        # Normalize to 0-100
        max_score = max(profile.values()) if profile else 1.0
        if max_score <= 0:
            max_score = 1.0
        for cat in profile:
            profile[cat] = (profile[cat] / max_score) * 100.0

        # Top interests and interpretation
        primary = sorted(profile.items(), key=lambda kv: kv[1], reverse=True)[:3]
        interpretation = personality_analyzer.interpret_interests(profile)

        return {
            "profile": profile,
            "primary_interests": primary,
            "interpretation": interpretation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
# Aptitude (adaptive) APIs
# -----------------------------------------------------------------------------
@app.post("/assess/aptitude/next-question")
async def get_next_aptitude_question(current_performance: Dict):
    """Return the next question based on previous answers and current difficulty."""
    try:
        question = aptitude_engine.get_next_question(
            previous_answers=current_performance.get("answers", []),
            current_difficulty=current_performance.get("difficulty", 3),
        )
        return question
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assess/aptitude/score")
async def score_aptitude_test(responses: List[Dict]):
    """Score completed aptitude assessment and return breakdown + insights."""
    try:
        scores = aptitude_engine.calculate_scores(responses)
        return {
            "scores": scores,
            "interpretation": aptitude_engine.interpret_scores(scores),
            "strengths": aptitude_engine.identify_strengths(scores),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
# Rich recommendations
# -----------------------------------------------------------------------------
@app.post("/recommend/careers")
async def recommend_careers(request: RecommendationRequest):
    try:
        recs = career_recommender.recommend_careers(
            interests=request.profile.interests.dict(),
            aptitude=request.profile.aptitude.dict() if request.profile.aptitude else None,
            personality=request.profile.personality.dict() if request.profile.personality else None,
            class_level=request.profile.class_level,
        )
        return {"recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/streams")
async def recommend_streams(request: RecommendationRequest):
    try:
        recs = career_recommender.recommend_streams(
            interests=request.profile.interests.dict(),
            aptitude=request.profile.aptitude.dict() if request.profile.aptitude else None,
            class_level=request.profile.class_level,
        )
        return {"recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
# Simple /recommend endpoint (lightweight payload)
# -----------------------------------------------------------------------------
class AssessmentRequest(BaseModel):
    interests: Dict
    aptitude: Dict
    scores: Dict

@app.post("/recommend")
def recommend_simple(data: AssessmentRequest):
    """
    Minimal endpoint used by frontend quick flow.
    Returns simple lists of streams and careers.
    Replace with calls to career_recommender if you want data-driven results.
    """
    try:
        # Example: route by scores; placeholder logic
        streams = ["Science", "Commerce", "Arts"]
        careers = ["Engineer", "Accountant", "Designer"]
        return {"streams": streams, "careers": careers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)