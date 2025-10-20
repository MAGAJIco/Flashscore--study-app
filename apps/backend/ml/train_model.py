
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_training_data(n_samples=10000):
    """
    Generate synthetic training data for sports predictions.
    Features: [home_strength, away_strength, home_advantage, 
               recent_form_home, recent_form_away, head_to_head, injuries]
    Labels: 0=home win, 1=draw, 2=away win
    """
    np.random.seed(42)
    
    X = []
    y = []
    
    for _ in range(n_samples):
        home_strength = np.random.uniform(0.3, 1.0)
        away_strength = np.random.uniform(0.3, 1.0)
        home_advantage = np.random.uniform(0.5, 0.8)
        recent_form_home = np.random.uniform(0.2, 1.0)
        recent_form_away = np.random.uniform(0.2, 1.0)
        head_to_head = np.random.uniform(0.3, 0.7)
        injuries = np.random.uniform(0.4, 1.0)
        
        features = [
            home_strength, away_strength, home_advantage,
            recent_form_home, recent_form_away, head_to_head, injuries
        ]
        
        # Calculate outcome probabilities
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
        
        # Determine outcome
        diff = home_score - away_score
        if diff > 0.15:
            label = 0  # home win
        elif diff < -0.15:
            label = 2  # away win
        else:
            label = 1  # draw
        
        X.append(features)
        y.append(label)
    
    return np.array(X), np.array(y)

def train_model():
    """Train Random Forest model for match predictions"""
    logger.info("🏋️ Starting model training...")
    
    # Generate training data
    X, y = generate_training_data(10000)
    logger.info(f"✅ Generated {len(X)} training samples")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    logger.info("🔧 Training Random Forest model...")
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    logger.info(f"📊 Training accuracy: {train_score:.3f}")
    logger.info(f"📊 Test accuracy: {test_score:.3f}")
    
    # Save model with version info
    import sklearn
    model_data = {
        "model": model,
        "scaler": scaler,
        "accuracy": test_score,
        "version": "MagajiCo-v2.1",
        "sklearn_version": sklearn.__version__,
        "trained_date": np.datetime64('now').astype(str)
    }
    
    with open("model_data.pkl", "wb") as f:
        pickle.dump(model_data, f)
    
    logger.info("✅ Model saved to model_data.pkl")
    return model, scaler, test_score

if __name__ == "__main__":
    train_model()
