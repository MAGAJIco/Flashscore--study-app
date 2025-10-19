from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from predictionModel import MagajiCoMLPredictor
import uvicorn
import os
import asyncio
from collections import deque
import time

# Request queue for load management
request_queue = deque(maxlen=1000)
processing_semaphore = asyncio.Semaphore(10)  # Max 10 concurrent predictions

app = FastAPI(
    title="MagajiCo ML Prediction API",
    description="Advanced sports prediction using Machine Learning",
    version="3.0.0"
)

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()
    
    # Simple in-memory rate limiting (100 requests per minute per IP)
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

# CORS configuration
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

# Initialize ML predictor
model_path = os.path.join(os.path.dirname(__file__), "model_data.pkl")
predictor = MagajiCoMLPredictor(model_path=model_path)

# Request models
class PredictionRequest(BaseModel):
    features: List[float] = Field(..., min_length=7, max_length=7)
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
    import psutil
    import time
    
    # Advanced health metrics
    cpu_percent = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    
    status = "healthy"
    if cpu_percent > 90 or memory.percent > 85:
        status = "degraded"
    
    return {
        "status": status,
        "model_loaded": predictor.model is not None,
        "model_version": predictor.model_version,
        "accuracy": predictor.accuracy,
        "metrics": {
            "cpu_percent": cpu_percent,
            "memory_percent": memory.percent,
            "memory_available_mb": memory.available / 1024 / 1024,
            "uptime_seconds": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
        },
        "timestamp": time.time()
    }

@app.on_event("startup")
async def startup_event():
    import time
    app.state.start_time = time.time()
    print("🚀 ML Service started successfully")

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
    # Check cache first
    import hashlib
    cache_key = hashlib.md5(str(request.features).encode()).hexdigest()
    
    if not hasattr(app.state, 'prediction_cache'):
        app.state.prediction_cache = {}
    
    if cache_key in app.state.prediction_cache:
        cached_result, timestamp = app.state.prediction_cache[cache_key]
        if time.time() - timestamp < 300:  # 5 minute cache
            cached_result['cached'] = True
            return cached_result
    
    try:
        # Use semaphore to limit concurrent predictions
        async with processing_semaphore:
            result = predictor.predict(request.features)

        response = PredictionResponse(
            prediction=result["prediction"],
            confidence=result["confidence"] * 100,  # Convert to percentage
            probabilities={
                k: v * 100 for k, v in result["probabilities"].items()
            },
            model_version=result["model_version"],
            features_used=request.features,
            match_context=request.match_context
        )
        
        # Cache the result
        app.state.prediction_cache[cache_key] = (response.dict(), time.time())
        
        return response
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
    from monitoring import monitor
    
    runtime_stats = monitor.get_stats()
    
    return {
        "model_version": predictor.model_version,
        "accuracy": predictor.accuracy,
        "model_type": "Random Forest" if predictor.model else "Rule-based",
        "features_required": predictor.features_required,
        "prediction_types": predictor.prediction_types,
        "status": "trained" if predictor.model else "fallback",
        "runtime_metrics": runtime_stats,
        "cache_size": len(app.state.prediction_cache) if hasattr(app.state, 'prediction_cache') else 0
    }

@app.get("/metrics")
async def get_metrics():
    """
    Prometheus-compatible metrics endpoint
    """
    from monitoring import monitor
    stats = monitor.get_stats()
    
    metrics = f"""# HELP ml_requests_total Total number of prediction requests
# TYPE ml_requests_total counter
ml_requests_total {stats['total_requests']}

# HELP ml_errors_total Total number of errors
# TYPE ml_errors_total counter
ml_errors_total {stats['error_count']}

# HELP ml_latency_avg Average prediction latency in milliseconds
# TYPE ml_latency_avg gauge
ml_latency_avg {stats['avg_latency_ms']}

# HELP ml_uptime_seconds Service uptime in seconds
# TYPE ml_uptime_seconds counter
ml_uptime_seconds {stats['uptime_seconds']}
"""
    return metrics

if __name__ == "__main__":
    port = int(os.getenv("PORT", os.getenv("ML_PORT", 8000)))
    environment = os.getenv("ENVIRONMENT", "development")
    
    print(f"🤖 Starting ML Service on http://0.0.0.0:{port} ({environment} mode)")
    
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=port,
        reload=(environment == "development"),
        log_level="info"
    )