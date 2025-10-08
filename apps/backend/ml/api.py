from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from predictionModel import MagajiCoMLPredictor
import uvicorn
import os

app = FastAPI(
    title="MagajiCo ML Prediction API",
    description="Advanced sports prediction using Machine Learning",
    version="3.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML predictor
model_path = os.path.join(os.path.dirname(__file__), "model_data.pkl")
predictor = MagajiCoMLPredictor(model_path=model_path)

# Request models
class PredictionRequest(BaseModel):
    features: List[float] = Field(..., min_items=7, max_items=7)
    match_context: Optional[Dict[str, str]] = None

class BatchPredictionRequest(BaseModel):
    predictions: List[PredictionRequest]

class TrainingRequest(BaseModel):
    data: List[List[float]]
    labels: List[int]

# Response models
class PredictionResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    model_version: str
    features_used: List[float]
    match_context: Optional[Dict[str, str]] = None

@app.get("/")
async def root():
    return {
        "service": "MagajiCo ML Prediction API",
        "version": "3.0.0",
        "status": "operational",
        "endpoints": {
            "predict": "/predict",
            "batch": "/predict/batch",
            "health": "/health",
            "model_info": "/model/info",
            "train": "/train"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": predictor.model is not None,
        "model_version": predictor.model_version,
        "accuracy": predictor.accuracy
    }

@app.get("/model/info")
async def get_model_info():
    return predictor.get_model_info()

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make a prediction based on match features.
    
    Features (7 values, each 0-1):
    - home_form: Recent home team performance
    - away_form: Recent away team performance  
    - h2h_ratio: Head-to-head win ratio for home team
    - home_goals_for: Home team average goals scored
    - home_goals_against: Home team average goals conceded
    - away_goals_for: Away team average goals scored
    - away_goals_against: Away team average goals conceded
    """
    try:
        result = predictor.predict(request.features)
        
        return PredictionResponse(
            prediction=result["prediction"],
            confidence=result["confidence"] * 100,  # Convert to percentage
            probabilities={
                k: v * 100 for k, v in result["probabilities"].items()
            },
            model_version=result["model_version"],
            features_used=request.features,
            match_context=request.match_context
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/batch")
async def batch_predict(request: BatchPredictionRequest):
    """
    Make multiple predictions at once
    """
    try:
        predictions = []
        for pred_request in request.predictions:
            result = predictor.predict(pred_request.features)
            predictions.append({
                "prediction": result["prediction"],
                "confidence": result["confidence"] * 100,
                "probabilities": {k: v * 100 for k, v in result["probabilities"].items()},
                "features": pred_request.features,
                "match_context": pred_request.match_context
            })
        
        return {
            "success": True,
            "count": len(predictions),
            "predictions": predictions,
            "model_version": predictor.model_version
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/train")
async def train_model(request: TrainingRequest):
    """
    Train or retrain the ML model with new data
    """
    try:
        result = predictor.train(request.data, request.labels)
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/stats")
async def get_statistics():
    """
    Get prediction statistics and model performance metrics
    """
    return {
        "model_version": predictor.model_version,
        "accuracy": predictor.accuracy,
        "model_type": "Random Forest" if predictor.model else "Rule-based",
        "features_required": predictor.features_required,
        "prediction_types": predictor.prediction_types,
        "status": "trained" if predictor.model else "fallback"
    }

if __name__ == "__main__":
    port = int(os.getenv("ML_PORT", 8000))
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
