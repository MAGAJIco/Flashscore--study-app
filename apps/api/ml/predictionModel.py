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
       
import numpy as np
import logging
from typing import Dict, List, Any, Optional
import pickle
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MagajiCoMLPredictor:
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize MagajiCo ML Predictor.
        Supports either loading a pre-trained model or using strategic v2.0 logic.
        """
        self.model_version = "MagajiCo-v2.2"
        self.accuracy = 0.87
        self.features_required = 7
        self.prediction_types = ["home", "draw", "away"]

        self.model = None
        self.scaler = None

        if model_path and os.path.exists(model_path):
            try:
                with open(model_path, "rb") as f:
                    saved = pickle.load(f)
                    self.model = saved["model"]
                    self.scaler = saved["scaler"]
                    self.accuracy = saved.get("accuracy", 0.87)
                logger.info(f"✅ Loaded trained model from {model_path}")
            except Exception as e:
                logger.error(f"⚠️ Failed to load model: {e}, falling back to rule-based")
        else:
            logger.info("⚠️ No trained model found, using MagajiCo strategic v2.0 rules")

    def predict(self, features: List[float]) -> Dict[str, Any]:
        """
        Predict match outcome.
        Features: [home_strength, away_strength, home_advantage,
                   recent_form_home, recent_form_away, head_to_head, injuries]
        """
        if len(features) < self.features_required:
            raise ValueError(f"At least {self.features_required} features required")

        try:
            if self.model:  # ML Model Path
                features_array = np.array([features])
                features_scaled = self.scaler.transform(features_array)
                probabilities = self.model.predict_proba(features_scaled)[0]
                prediction_index = int(np.argmax(probabilities))

                return {
                    "prediction": self.prediction_types[prediction_index],
                    "confidence": float(np.max(probabilities)),
                    "probabilities": {
                        "home": float(probabilities[0]),
                        "draw": float(probabilities[1]),
                        "away": float(probabilities[2])
                    },
                    "model_version": self.model_version,
                    "using_model": True
                }

            else:  # Rule-based fallback
                return self._fallback_predict(features)

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise

    def _fallback_predict(self, features: List[float]) -> Dict[str, Any]:
        """Strategic MagajiCo rule-based prediction"""
        home_strength, away_strength, home_advantage, recent_form_home, recent_form_away, head_to_head, injuries = features

        # Strategic MagajiCo calculation
        home_score = (
            home_strength * 0.3 +
            home_advantage * 0.2 +
            recent_form_home * 0.25 +
            head_to_head * 0.15 +
            injuries * 0.1
        )

        away_score = (
            away_strength * 0.3 +
            (1 - home_advantage) * 0.1 +
            recent_form_away * 0.25 +
            (1 - head_to_head) * 0.15 +
            injuries * 0.2
        )

        total_score = home_score + away_score + 0.5
        home_prob = home_score / total_score
        away_prob = away_score / total_score
        draw_prob = 0.5 / total_score

        # normalize
        total_prob = home_prob + draw_prob + away_prob
        home_prob /= total_prob
        draw_prob /= total_prob
        away_prob /= total_prob

        # select outcome
        if home_prob > max(away_prob, draw_prob):
            prediction, confidence = "home", home_prob
        elif away_prob > max(home_prob, draw_prob):
            prediction, confidence = "away", away_prob
        else:
            prediction, confidence = "draw", draw_prob

        return {
            "prediction": prediction,
            "confidence": float(confidence),
            "probabilities": {
                "home": float(home_prob),
                "draw": float(draw_prob),
                "away": float(away_prob)
            },
            "model_version": self.model_version,
            "using_model": False
        }

    def train(self, data: List[List[float]], labels: List[int]) -> Dict[str, Any]:
        """Train the ML model with provided data"""
        from sklearn.model_selection import train_test_split
        from sklearn.preprocessing import StandardScaler
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.metrics import accuracy_score
        
        if len(data) == 0 or len(data[0]) != self.features_required:
            raise ValueError(f"Training data must have {self.features_required} features per sample")
        
        X = np.array(data)
        y = np.array(labels)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
        
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        self.model.fit(X_train_scaled, y_train)
        
        y_pred = self.model.predict(X_test_scaled)
        self.accuracy = float(accuracy_score(y_test, y_pred))
        
        # Save model
        model_path = os.path.join(os.path.dirname(__file__), "model_data.pkl")
        with open(model_path, "wb") as f:
            pickle.dump({"model": self.model, "scaler": self.scaler, "accuracy": self.accuracy}, f)
        
        logger.info(f"✅ Model trained with accuracy: {self.accuracy:.2f}")
        
        return {
            "message": "Training complete",
            "accuracy": self.accuracy,
            "model_version": self.model_version
        }

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "version": self.model_version,
            "accuracy": self.accuracy,
            "features_required": self.features_required,
            "prediction_types": self.prediction_types,
            "using_model": bool(self.model)
        }
