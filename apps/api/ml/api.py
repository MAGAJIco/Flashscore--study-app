
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
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
from dotenv import load_dotenv
from sports_api import create_sports_api_service, LiveMatch, OddsData

load_dotenv()

app = FastAPI(
    title="Sports API Aggregation Service",
    description="Multi-source sports data aggregation API supporting NFL, NBA, MLB, and Soccer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = create_sports_api_service()


@app.get("/")
async def root():
    return {
        "message": "Sports API Aggregation Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "api_health": "/api/health",
            "all_matches": "/api/matches",
            "nfl": "/api/nfl",
            "nba": "/api/nba",
            "mlb": "/api/mlb",
            "soccer": "/api/soccer",
            "soccer_predictions": "/api/predictions/soccer",
            "statarea_predictions": "/api/predictions/statarea",
            "flashscore_over45": "/api/predictions/flashscore/over45",
            "combined_predictions": "/api/predictions/combined",
            "odds": "/api/odds/{sport}",
            "espn_nfl": "/api/espn/nfl",
            "espn_nba": "/api/espn/nba",
            "espn_mlb": "/api/espn/mlb"
        },
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Sports API Aggregation Service"
    }


@app.get("/api/health")
async def api_health():
    try:
        health_status = service.check_api_health()
        healthy_count = sum(1 for h in health_status if h["status"] == "healthy")
        total_count = len(health_status)
        
        return {
            "summary": {
                "healthy": healthy_count,
                "total": total_count,
                "percentage": round((healthy_count / total_count) * 100, 2) if total_count > 0 else 0
            },
            "services": health_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/matches")
async def get_all_matches():
    try:
        matches = service.fetch_all_live_matches()
        return {
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch matches: {str(e)}")


@app.get("/api/nfl")
async def get_nfl_matches(source: str = Query("espn", description="Data source: 'rapidapi' or 'espn'")):
    try:
        if source.lower() == "rapidapi":
            matches = service.fetch_nfl_matches()
        else:
            matches = service.fetch_espn_nfl()
        
        return {
            "sport": "NFL",
            "source": source,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch NFL matches: {str(e)}")


@app.get("/api/nba")
async def get_nba_matches(source: str = Query("espn", description="Data source: 'rapidapi' or 'espn'")):
    try:
        if source.lower() == "rapidapi":
            matches = service.fetch_nba_matches()
        else:
            matches = service.fetch_espn_nba()
        
        return {
            "sport": "NBA",
            "source": source,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch NBA matches: {str(e)}")


@app.get("/api/mlb")
async def get_mlb_matches(source: str = Query("espn", description="Data source: 'rapidapi' or 'espn'")):
    try:
        if source.lower() == "rapidapi":
            matches = service.fetch_mlb_matches()
        else:
            matches = service.fetch_espn_mlb()
        
        return {
            "sport": "MLB",
            "source": source,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch MLB matches: {str(e)}")


@app.get("/api/soccer")
async def get_soccer_matches():
    try:
        matches = service.fetch_soccer_matches()
        return {
            "sport": "Soccer",
            "league": "Premier League",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch soccer matches: {str(e)}")


@app.get("/api/espn/nfl")
async def get_espn_nfl():
    try:
        matches = service.fetch_espn_nfl()
        return {
            "sport": "NFL",
            "source": "ESPN",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ESPN NFL data: {str(e)}")




@app.get("/api/odds/{sport}/best")
async def get_best_odds(sport: str):
    """
    Get best available odds across all bookmakers for each game
    Returns the highest odds for each outcome
    """
    try:
        sport_upper = sport.upper()
        if sport_upper not in ["NFL", "NBA", "MLB", "SOCCER"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported sport: {sport}. Supported: NFL, NBA, MLB, SOCCER"
            )
        
        odds = service.fetch_odds_data(sport_upper)
        
        # Find best odds for each game
        best_odds = {}
        for odd in odds:
            game_id = odd.game_id
            if game_id not in best_odds:
                best_odds[game_id] = {
                    "game_id": game_id,
                    "best_home_odds": {"odds": 0, "bookmaker": ""},
                    "best_away_odds": {"odds": 0, "bookmaker": ""},
                    "best_draw_odds": {"odds": 0, "bookmaker": ""} if odd.draw_odds else None
                }
            
            # Update best home odds
            if odd.home_odds > best_odds[game_id]["best_home_odds"]["odds"]:
                best_odds[game_id]["best_home_odds"] = {
                    "odds": odd.home_odds,
                    "bookmaker": odd.bookmaker
                }
            
            # Update best away odds
            if odd.away_odds > best_odds[game_id]["best_away_odds"]["odds"]:
                best_odds[game_id]["best_away_odds"] = {
                    "odds": odd.away_odds,
                    "bookmaker": odd.bookmaker
                }
            
            # Update best draw odds if applicable
            if odd.draw_odds and best_odds[game_id]["best_draw_odds"]:
                if odd.draw_odds > best_odds[game_id]["best_draw_odds"]["odds"]:
                    best_odds[game_id]["best_draw_odds"] = {
                        "odds": odd.draw_odds,
                        "bookmaker": odd.bookmaker
                    }
        
        return {
            "sport": sport_upper,
            "count": len(best_odds),
            "best_odds": list(best_odds.values())
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch best odds: {str(e)}")


@app.get("/api/espn/nba")
async def get_espn_nba():
    try:
        matches = service.fetch_espn_nba()
        return {
            "sport": "NBA",
            "source": "ESPN",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ESPN NBA data: {str(e)}")


@app.get("/api/espn/mlb")
async def get_espn_mlb():
    try:
        matches = service.fetch_espn_mlb()
        return {
            "sport": "MLB",
            "source": "ESPN",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ESPN MLB data: {str(e)}")


@app.get("/api/odds/{sport}")
async def get_odds(
    sport: str,
    bookmaker: Optional[str] = Query(None, description="Filter by bookmaker (e.g., 'draftkings', 'fanduel')")
):
    """
    Get betting odds for a specific sport with optional bookmaker filtering
    
    Supported sports: NFL, NBA, MLB, SOCCER
    Popular bookmakers: draftkings, fanduel, betmgm, caesars
    """
    try:
        sport_upper = sport.upper()
        if sport_upper not in ["NFL", "NBA", "MLB", "SOCCER"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported sport: {sport}. Supported: NFL, NBA, MLB, SOCCER"
            )
        
        odds = service.fetch_odds_data(sport_upper, bookmaker=bookmaker)
        
        # Group odds by game for better readability
        games_odds = {}
        for odd in odds:
            game_id = odd.game_id
            if game_id not in games_odds:
                games_odds[game_id] = {
                    "game_id": game_id,
                    "bookmakers": []
                }
            games_odds[game_id]["bookmakers"].append(odd.to_dict())
        
        return {
            "sport": sport_upper,
            "filter": {
                "bookmaker": bookmaker if bookmaker else "all"
            },
            "total_games": len(games_odds),
            "total_odds": len(odds),
            "games": list(games_odds.values())
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch odds data: {str(e)}")


@app.get("/api/predictions/soccer")
async def get_soccer_predictions(
    min_confidence: int = Query(86, description="Minimum confidence percentage (86% = odds 1.16, 77% = odds 1.30)", ge=50, le=100),
    max_odds: Optional[float] = Query(None, description="Maximum odds filter (e.g., 1.16, 1.30)", ge=1.01, le=10.0),
    date: str = Query("today", description="Date filter: 'today', 'tomorrow', or specific date")
):
    """
    Get recommended soccer predictions from mybets.today with flexible filtering
    
    Filter options:
    - min_confidence: Filter by confidence percentage (default 86%)
    - max_odds: Filter by maximum odds (overrides min_confidence)
    - date: Date filter - 'today' (default), 'tomorrow', or specific date
    
    Examples:
    - min_confidence=86 → odds <= 1.16 (safe bets)
    - max_odds=1.30 → confidence >= 77%
    - min_confidence=75 → odds <= 1.33
    - date=tomorrow → get tomorrow's predictions
    """
    try:
        predictions = service.fetch_mybetstoday_predictions(
            min_confidence=min_confidence,
            max_odds=max_odds,
            date=date
        )
        
        # Calculate actual filter values
        if max_odds:
            actual_min_conf = int(100 / max_odds)
            implied_odds = max_odds
        else:
            actual_min_conf = min_confidence
            implied_odds = round(100 / min_confidence, 2) if min_confidence > 0 else 0
        
        return {
            "source": "MyBetsToday",
            "description": f"Soccer predictions for {date} with confidence >= {actual_min_conf}% (odds <= {implied_odds})",
            "filter": {
                "min_confidence": actual_min_conf,
                "max_odds_applied": implied_odds,
                "date": date,
                "total_available": len(predictions)
            },
            "count": len(predictions),
            "predictions": predictions,
            "recommendations": {
                "very_safe": sum(1 for p in predictions if p.get("confidence", 0) >= 90),
                "safe": sum(1 for p in predictions if 85 <= p.get("confidence", 0) < 90),
                "moderate": sum(1 for p in predictions if 75 <= p.get("confidence", 0) < 85)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch predictions: {str(e)}")


@app.get("/api/predictions/statarea")
async def get_statarea_predictions(
    min_odds: float = Query(1.5, description="Minimum odds to filter (default 1.5)", ge=1.01, le=10.0),
    max_odds: Optional[float] = Query(None, description="Maximum odds filter (e.g., 3.0, 5.0)", ge=1.01, le=20.0),
    prediction_type: Optional[str] = Query(None, description="Filter by prediction type (e.g., '1X2', 'BTTS', 'Over/Under')")
):
    """
    Get soccer predictions from StatArea with flexible filtering
    
    Filter options:
    - min_odds: Minimum odds to include (default 1.5)
    - max_odds: Maximum odds to include (optional)
    - prediction_type: Filter by specific prediction type (optional)
    
    Examples:
    - min_odds=1.5&max_odds=3.0 → odds between 1.5 and 3.0
    - prediction_type=BTTS → only Both Teams To Score predictions
    - min_odds=2.0 → odds >= 2.0
    """
    try:
        predictions = service.fetch_statarea_predictions(
            min_odds=min_odds,
            max_odds=max_odds,
            prediction_type=prediction_type
        )
        
        return {
            "source": "StatArea",
            "description": f"Soccer predictions with odds >= {min_odds}" + (f" and <= {max_odds}" if max_odds else ""),
            "filter": {
                "min_odds": min_odds,
                "max_odds": max_odds,
                "prediction_type": prediction_type,
                "total_available": len(predictions)
            },
            "count": len(predictions),
            "predictions": predictions,
            "odds_summary": {
                "low_odds": sum(1 for p in predictions if p.get("odds", 0) < 2.0),
                "medium_odds": sum(1 for p in predictions if 2.0 <= p.get("odds", 0) < 3.0),
                "high_odds": sum(1 for p in predictions if p.get("odds", 0) >= 3.0)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch StatArea predictions: {str(e)}")


@app.get("/api/predictions/flashscore/over45")
async def get_flashscore_over45(
    exclude_african: bool = Query(True, description="Exclude African leagues/teams"),
    min_odds: float = Query(1.5, description="Minimum odds filter", ge=1.01, le=10.0),
    max_odds: Optional[float] = Query(None, description="Maximum odds filter", ge=1.01, le=20.0)
):
    """
    Get Over 4.5 goals predictions from FlashScore odds
    
    This endpoint fetches matches with Over 4.5 goals betting odds from FlashScore,
    filtering out African teams by default.
    
    Filter options:
    - exclude_african: Exclude African leagues/teams (default True)
    - min_odds: Minimum odds to include (default 1.5)
    - max_odds: Maximum odds to include (optional)
    
    Returns predictions sorted by odds (lowest/safest first)
    """
    try:
        predictions = service.fetch_flashscore_over45_predictions(
            exclude_african=exclude_african
        )
        
        # Apply odds filters
        filtered_predictions = [
            p for p in predictions 
            if p['odds'] >= min_odds and (max_odds is None or p['odds'] <= max_odds)
        ]
        
        return {
            "source": "FlashScore",
            "description": f"Over 4.5 goals predictions" + (" (excluding African teams)" if exclude_african else ""),
            "filter": {
                "exclude_african": exclude_african,
                "min_odds": min_odds,
                "max_odds": max_odds,
                "total_available": len(filtered_predictions)
            },
            "count": len(filtered_predictions),
            "predictions": filtered_predictions,
            "odds_summary": {
                "low_odds_1.5-2.5": sum(1 for p in filtered_predictions if 1.5 <= p.get("odds", 0) < 2.5),
                "medium_odds_2.5-4.0": sum(1 for p in filtered_predictions if 2.5 <= p.get("odds", 0) < 4.0),
                "high_odds_4.0+": sum(1 for p in filtered_predictions if p.get("odds", 0) >= 4.0)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch FlashScore predictions: {str(e)}")


@app.get("/api/predictions/combined")
async def get_combined_predictions(
    min_confidence: int = Query(86, description="Minimum confidence percentage for both sources", ge=50, le=100),
    date: str = Query("today", description="Date filter: 'today', 'tomorrow'")
):
    """
    Get high-confidence predictions that appear in BOTH MyBetsToday AND StatArea
    
    This endpoint combines predictions from both sources and only returns matches
    where both sources agree, giving you the highest confidence bets.
    
    Filter options:
    - min_confidence: Minimum confidence % required from both sources (default 86%)
    - date: 'today' or 'tomorrow'
    
    Returns predictions sorted by average confidence (highest first)
    """
    try:
        # Fetch from both sources
        mybets_predictions = service.fetch_mybetstoday_predictions(
            min_confidence=min_confidence,
            date=date
        )
        
        # Convert min_confidence to odds range for StatArea
        max_odds_for_statarea = round(100 / min_confidence, 2)
        statarea_predictions = service.fetch_statarea_predictions(
            min_odds=1.01,
            max_odds=max_odds_for_statarea
        )
        
        # Find matches that appear in both sources
        combined_predictions = []
        
        for mybets in mybets_predictions:
            mybets_teams = {mybets['home_team'].lower(), mybets['away_team'].lower()}
            
            for statarea in statarea_predictions:
                statarea_teams = {statarea['home_team'].lower(), statarea['away_team'].lower()}
                
                # Check if teams match (allowing for slight name variations)
                if mybets_teams == statarea_teams or len(mybets_teams & statarea_teams) >= 2:
                    avg_confidence = (mybets['confidence'] + statarea['confidence']) // 2
                    avg_odds = round((mybets['implied_odds'] + statarea['odds']) / 2, 2)
                    
                    combined_predictions.append({
                        "home_team": mybets['home_team'],
                        "away_team": mybets['away_team'],
                        "game_time": mybets['game_time'],
                        "mybets_prediction": mybets['prediction'],
                        "mybets_confidence": mybets['confidence'],
                        "mybets_odds": mybets['implied_odds'],
                        "statarea_prediction": statarea['prediction'],
                        "statarea_confidence": statarea['confidence'],
                        "statarea_odds": statarea['odds'],
                        "average_confidence": avg_confidence,
                        "average_odds": avg_odds,
                        "predictions_match": mybets['prediction'] == statarea['prediction'],
                        "league": statarea.get('league', 'Unknown'),
                        "status": "verified"
                    })
                    break
        
        # Sort by average confidence (highest first)
        combined_predictions.sort(key=lambda x: x['average_confidence'], reverse=True)
        
        return {
            "description": f"Predictions verified by BOTH sources with min {min_confidence}% confidence",
            "date": date,
            "filter": {
                "min_confidence": min_confidence,
                "max_odds": max_odds_for_statarea
            },
            "sources": {
                "mybets_total": len(mybets_predictions),
                "statarea_total": len(statarea_predictions),
                "verified_matches": len(combined_predictions)
            },
            "count": len(combined_predictions),
            "predictions": combined_predictions,
            "safety_tiers": {
                "ultra_safe_90+": sum(1 for p in combined_predictions if p['average_confidence'] >= 90),
                "very_safe_85-90": sum(1 for p in combined_predictions if 85 <= p['average_confidence'] < 90),
                "safe_80-85": sum(1 for p in combined_predictions if 80 <= p['average_confidence'] < 85),
                "moderate_75-80": sum(1 for p in combined_predictions if 75 <= p['average_confidence'] < 80)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch combined predictions: {str(e)}")


@app.get("/api/config")
async def get_config():
    return {
        "api_keys_configured": {
            "rapidapi": bool(os.getenv("RAPIDAPI_KEY")),
            "odds_api": bool(os.getenv("ODDS_API_KEY")),
            "football_data": bool(os.getenv("FOOTBALL_DATA_API_KEY"))
        },
        "available_sources": {
            "free": ["ESPN NFL", "ESPN NBA", "ESPN MLB", "MyBetsToday Soccer Predictions", "StatArea Predictions"],
            "premium": [
                "RapidAPI (NFL, NBA, MLB)" if os.getenv("RAPIDAPI_KEY") else None,
                "The Odds API" if os.getenv("ODDS_API_KEY") else None,
                "Football-Data.org" if os.getenv("FOOTBALL_DATA_API_KEY") else None
            ]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5000,
        log_level="info",
        access_log=True
    )
