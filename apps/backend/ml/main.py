from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.magajico_predictor import MagajiCoMLPredictor
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from typing import List

app = FastAPI(
    title="MagajiCo ML Prediction API",
    version="2.2.0",
    description="⚡ MagajiCo sports prediction system with training + prediction endpoints"
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

MODEL_PATH = "model_data.pkl"
predictor = MagajiCoMLPredictor(model_path=MODEL_PATH)


class FeaturesInput(BaseModel):
    features: List[float]


@app.get("/")
def root():
    return {
        "message": "Welcome to MagajiCo Prediction API 🚀",
        "model_info": predictor.get_model_info()
    }


@app.post("/predict")
def predict(data: FeaturesInput):
    try:
        result = predictor.predict(data.features)
        return {"success": True, "result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/model-info")
def model_info():
    return predictor.get_model_info()


@app.post("/train")
async def train_model(file: UploadFile = File(...)):
    """
    Train and save a new ML model.
    Expected CSV format:
    home_strength,away_strength,home_advantage,recent_form_home,recent_form_away,head_to_head,injuries,outcome
    """
    try:
        df = pd.read_csv(file.file)

        # Validate columns
        required_cols = [
            "home_strength", "away_strength", "home_advantage",
            "recent_form_home", "recent_form_away", "head_to_head", "injuries", "outcome"
        ]
        if not all(col in df.columns for col in required_cols):
            raise ValueError(f"CSV must contain: {required_cols}")

        X = df[required_cols[:-1]]
        y = df["outcome"]  # should be 'home', 'draw', or 'away'

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        model = RandomForestClassifier(n_estimators=120, random_state=42)
        model.fit(X_train_scaled, y_train)

        accuracy = model.score(X_test_scaled, y_test)

        # Save model + scaler
        joblib.dump({"model": model, "scaler": scaler}, MODEL_PATH)

        global predictor
        predictor = MagajiCoMLPredictor(model_path=MODEL_PATH)
        predictor.accuracy = round(float(accuracy), 4)

        return {
            "message": "✅ Model trained and saved successfully!",
            "accuracy": accuracy,
            "model_info": predictor.get_model_info()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")