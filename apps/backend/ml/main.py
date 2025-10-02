from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import logging
from predictionModel import MagajiCoMLPredictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MagajiCo ML Prediction API",
    description="Machine Learning API for sports predictions",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = MagajiCoMLPredictor(model_path="model_data.pkl")

class PredictionRequest(BaseModel):
    features: List[float] = Field(
        ...,
        description="7 features: [home_strength, away_strength, home_advantage, recent_form_home, recent_form_away, head_to_head, injuries]",
        min_items=7,
        max_items=7
    )

class MatchPredictionRequest(BaseModel):
    homeTeam: str
    awayTeam: str
    homeTeamStats: Dict[str, Any] = {}
    awayTeamStats: Dict[str, Any] = {}

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    model_version: str

@app.get("/")
async def root():
    return {
        "name": "MagajiCo ML Prediction API",
        "version": "2.1.0",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "model_info": "/model-info"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ml-prediction",
        "model": predictor.get_model_info()
    }

@app.get("/model-info")
async def model_info():
    return predictor.get_model_info()

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        result = predictor.predict(request.features)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.post("/predict-match")
async def predict_match(request: MatchPredictionRequest):
    """Predict match outcome from team data"""
    try:
        # Extract features from team stats or use defaults
        home_strength = request.homeTeamStats.get("strength", 0.7)
        away_strength = request.awayTeamStats.get("strength", 0.6)
        home_advantage = 0.65
        recent_form_home = request.homeTeamStats.get("form", 0.6)
        recent_form_away = request.awayTeamStats.get("form", 0.5)
        head_to_head = 0.5
        injuries = request.homeTeamStats.get("injuries", 0.8)
        
        features = [
            home_strength, away_strength, home_advantage,
            recent_form_home, recent_form_away, head_to_head, injuries
        ]
        
        result = predictor.predict(features)
        
        return {
            "homeTeam": request.homeTeam,
            "awayTeam": request.awayTeam,
            "predictedWinner": result["prediction"],
            "confidence": result["confidence"],
            "probabilities": result["probabilities"],
            "modelVersion": result["model_version"]
        }
    except Exception as e:
        logger.error(f"Match prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Match prediction failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
