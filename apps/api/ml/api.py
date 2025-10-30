
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
import sys
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from predictionModel import MagajiCoMLPredictor
from contextlib import asynccontextmanager
import uvicorn
import os
import asyncio
from collections import deque
import time
from datetime import datetime

# Request queue for load management
request_queue = deque(maxlen=1000)
processing_semaphore = asyncio.Semaphore(10)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.start_time = time.time()
    print("🚀 ML Service started successfully")
    yield
    print("👋 ML Service shutting down")

app = FastAPI(
    title="MagajiCo ML Prediction API",
    description="Advanced sports prediction using Machine Learning",
    version="3.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()

    if not hasattr(app.state, 'rate_limits'):
        app.state.rate_limits = {}

    if client_ip in app.state.rate_limits:
        requests, window_start = app.state.rate_limits[client_ip]
        if current_time - window_start < 60:
            if requests >= 100:
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            app.state.rate_limits[client_ip] = (requests + 1, window_start)
        else:
            app.state.rate_limits[client_ip] = (1, current_time)
    else:
        app.state.rate_limits[client_ip] = (1, current_time)

    response = await call_next(request)
    return response

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

if ENVIRONMENT == "production" and FRONTEND_URL:
    allowed_origins = [FRONTEND_URL]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = os.path.join(os.path.dirname(__file__), "model_data.pkl")
predictor = MagajiCoMLPredictor(model_path=model_path)

class PredictionRequest(BaseModel):
    features: List[float] = Field(..., min_length=7, max_length=7)
    match_context: Optional[Dict[str, str]] = None

class BatchPredictionRequest(BaseModel):
    predictions: List[PredictionRequest]

class TrainingRequest(BaseModel):
    data: List[List[float]]
    labels: List[int]

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
        "service": "ml",
        "model_loaded": predictor is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/model/info")
async def get_model_info():
    return predictor.get_model_info()

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    import hashlib
    cache_key = hashlib.md5(str(request.features).encode()).hexdigest()

    if not hasattr(app.state, 'prediction_cache'):
        app.state.prediction_cache = {}

    if cache_key in app.state.prediction_cache:
        cached_result, timestamp = app.state.prediction_cache[cache_key]
        if time.time() - timestamp < 300:
            cached_result['cached'] = True
            return cached_result

    try:
        async with processing_semaphore:
            result = predictor.predict(request.features)

        response = PredictionResponse(
            prediction=result["prediction"],
            confidence=result["confidence"] * 100,
            probabilities={k: v * 100 for k, v in result["probabilities"].items()},
            model_version=result["model_version"],
            features_used=request.features,
            match_context=request.match_context
        )

        app.state.prediction_cache[cache_key] = (response.dict(), time.time())
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/batch")
async def batch_predict(request: BatchPredictionRequest):
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
    try:
        result = predictor.train(request.data, request.labels)
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_details = {
        "service": "MagajiCo ML Service",
        "error": str(exc),
        "type": type(exc).__name__,
        "path": request.url.path,
        "timestamp": str(datetime.now()),
        "message": "ML service encountered an error but is still running"
    }

    print(f"🚨 ML Error: {exc}", file=sys.stderr)
    print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_details
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", os.getenv("ML_PORT", 8000)))
    environment = os.getenv("ENVIRONMENT", "development")

    print(f"🚀 ML Service starting on port {port}")

    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=port,
        reload=(environment == "development"),
        log_level="info"
    )
