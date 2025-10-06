import numpy as np
import logging
from typing import Dict, List, Any, Optional
import joblib
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
                saved = joblib.load(model_path)
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

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "version": self.model_version,
            "accuracy": self.accuracy,
            "features_required": self.features_required,
            "prediction_types": self.prediction_types,
            "using_model": bool(self.model)
        }