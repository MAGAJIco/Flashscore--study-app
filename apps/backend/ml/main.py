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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
