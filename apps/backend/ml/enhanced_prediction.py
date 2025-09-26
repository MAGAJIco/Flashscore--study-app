//backend/ml/enhanced_prediction.py
import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import warnings
warnings.filterwarnings('ignore')

class KalshiMarketIntelligence:
    """Kalshi-style prediction market analysis for real-world event probabilities"""
    
    def __init__(self):
        self.market_confidence_threshold = 0.65
        self.volume_weight_factor = 0.15
        self.news_sentiment_weight = 0.10
    
    def calculate_market_probability(self, features, historical_outcomes):
        """Calculate market-implied probabilities based on feature patterns"""
        # Simulate market depth and liquidity factors
        market_depth = min(1.0, features[0] * 0.8 + features[1] * 0.6)
        liquidity_factor = np.mean(features[3:7]) * 1.2
        
        # News sentiment integration (simulated)
        news_momentum = self._simulate_news_sentiment(features)
        
        market_prob = {
            'home_win': max(0.1, min(0.8, features[0] * 0.4 + market_depth * 0.3 + news_momentum * 0.1)),
            'draw': max(0.15, min(0.4, 0.33 - abs(features[0] - features[1]) * 0.2)),
            'away_win': max(0.1, min(0.8, features[1] * 0.4 + (1 - market_depth) * 0.3 - news_momentum * 0.05))
        }
        
        # Normalize probabilities
        total = sum(market_prob.values())
        return {k: v/total for k, v in market_prob.items()}
    
    def _simulate_news_sentiment(self, features):
        """Simulate news sentiment impact on market probabilities"""
        form_momentum = (features[0] - features[1]) * 0.1
        recent_performance = np.mean(features[3:5]) - np.mean(features[5:7])
        return np.tanh(form_momentum + recent_performance * 0.05)

class PinnacleSharpOdds:
    """Pinnacle-style sharp odds calculation with low margin, high accuracy"""
    
    def __init__(self):
        self.margin = 0.02  # 2% margin (very competitive)
        self.sharp_threshold = 0.75
        self.line_movement_weight = 0.08
    
    def calculate_sharp_odds(self, market_probs, features):
        """Calculate sharp odds with minimal margin and maximum accuracy"""
        # Pinnacle-style adjustments
        sharp_probs = market_probs.copy()
        
        # Sharp money indicators
        sharp_money_home = self._detect_sharp_money('home', features)
        sharp_money_away = self._detect_sharp_money('away', features)
        
        # Adjust for sharp action
        if sharp_money_home > 0.6:
            sharp_probs['home_win'] *= 1.05
            sharp_probs['away_win'] *= 0.95
        elif sharp_money_away > 0.6:
            sharp_probs['away_win'] *= 1.05
            sharp_probs['home_win'] *= 0.95
        
        # Line movement simulation
        line_movement = self._simulate_line_movement(features)
        sharp_probs['home_win'] += line_movement * 0.02
        sharp_probs['away_win'] -= line_movement * 0.02
        
        # Normalize and convert to odds
        total_prob = sum(sharp_probs.values())
        normalized_probs = {k: v/total_prob for k, v in sharp_probs.items()}
        
        # Add minimal margin
        margin_adjusted = {k: v * (1 - self.margin) for k, v in normalized_probs.items()}
        
        # Convert to decimal odds
        odds = {k: 1/v if v > 0 else 100 for k, v in margin_adjusted.items()}
        
        return {
            'probabilities': normalized_probs,
            'odds': odds,
            'sharp_confidence': max(sharp_money_home, sharp_money_away),
            'line_movement': line_movement
        }
    
    def _detect_sharp_money(self, side, features):
        """Detect sharp money movement patterns"""
        if side == 'home':
            return min(1.0, features[0] * 0.6 + (features[3] / max(features[4], 1)) * 0.2)
        else:
            return min(1.0, features[1] * 0.6 + (features[5] / max(features[6], 1)) * 0.2)
    
    def _simulate_line_movement(self, features):
        """Simulate betting line movement based on feature changes"""
        form_differential = features[0] - features[1]
        goal_differential = (features[3] - features[4]) - (features[5] - features[6])
        return np.tanh((form_differential + goal_differential * 0.1) * 0.5)

class MagajiCoMLPredictor:
    def __init__(self):
        # Initialize multiple models for ensemble prediction
        self.rf_model = RandomForestClassifier(
            n_estimators=150,
            max_depth=12,
            min_samples_split=5,
            random_state=42
        )
        
        self.gb_model = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        
        self.lr_model = LogisticRegression(
            random_state=42,
            max_iter=1000
        )
        
        self.scaler = StandardScaler()
        self.kalshi = KalshiMarketIntelligence()
        self.pinnacle = PinnacleSharpOdds()
        
        # Enhanced feature engineering
        self.feature_names = [
            'home_form', 'away_form', 'h2h_ratio', 
            'home_goals_for', 'home_goals_against',
            'away_goals_for', 'away_goals_against',
            'home_xg', 'away_xg', 'weather_factor',
            'injury_impact', 'motivation_index'
        ]
        
        self._train_ensemble()

    def _generate_enhanced_training_data(self, n_samples=2000):
        """Generate more sophisticated training data"""
        np.random.seed(42)
        
        # Generate base features
        X_train = np.random.rand(n_samples, len(self.feature_names))
        
        # Add realistic correlations
        for i in range(n_samples):
            # Correlation between form and goals
            if X_train[i, 0] > 0.7:  # Good home form
                X_train[i, 3] = min(1.0, X_train[i, 3] + 0.2)  # More goals for
                X_train[i, 4] = max(0.0, X_train[i, 4] - 0.15)  # Fewer goals against
            
            # Weather impact on goals
            if X_train[i, 9] < 0.3:  # Bad weather
                X_train[i, 3] *= 0.9  # Slightly fewer goals
                X_train[i, 5] *= 0.9
        
        # Generate realistic outcomes
        y_train = []
        for features in X_train:
            # Enhanced outcome logic
            home_strength = (
                features[0] * 0.3 +  # form
                (features[3] / max(features[4], 0.1)) * 0.2 +  # goal ratio
                features[7] * 0.15 +  # xG
                features[11] * 0.1 +  # motivation
                0.1  # home advantage
            )
            
            away_strength = (
                features[1] * 0.3 +
                (features[5] / max(features[6], 0.1)) * 0.2 +
                features[8] * 0.15 +
                features[11] * 0.05  # less motivation away
            )
            
            # Weather and injury adjustments
            home_strength *= (1 - features[10] * 0.1)  # injury impact
            away_strength *= (1 - features[10] * 0.15)  # away team more affected
            
            strength_diff = home_strength - away_strength
            
            # Probabilistic outcome assignment
            if strength_diff > 0.25:
                y_train.append(0)  # home win
            elif strength_diff < -0.25:
                y_train.append(2)  # away win
            else:
                # Closer games more likely to be draws
                draw_probability = 0.4 - abs(strength_diff) * 0.5
                if np.random.random() < draw_probability:
                    y_train.append(1)  # draw
                else:
                    y_train.append(0 if strength_diff > 0 else 2)
        
        return np.array(X_train), np.array(y_train)

    def _train_ensemble(self):
        """Train ensemble of models"""
        X_train, y_train = self._generate_enhanced_training_data()
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train all models
        self.rf_model.fit(X_train_scaled, y_train)
        self.gb_model.fit(X_train_scaled, y_train)
        self.lr_model.fit(X_train_scaled, y_train)
        
        # Calculate model weights based on cross-validation
        rf_score = np.mean(cross_val_score(self.rf_model, X_train_scaled, y_train, cv=5))
        gb_score = np.mean(cross_val_score(self.gb_model, X_train_scaled, y_train, cv=5))
        lr_score = np.mean(cross_val_score(self.lr_model, X_train_scaled, y_train, cv=5))
        
        total_score = rf_score + gb_score + lr_score
        self.model_weights = {
            'rf': rf_score / total_score,
            'gb': gb_score / total_score,
            'lr': lr_score / total_score
        }

    def _enhance_features(self, base_features):
        """Enhance basic features with advanced metrics"""
        enhanced = list(base_features)
        
        # Add expected goals (simulated)
        home_xg = base_features[3] * 0.8 + np.random.normal(0, 0.1)
        away_xg = base_features[5] * 0.8 + np.random.normal(0, 0.1)
        
        # Weather factor (simulated)
        weather_factor = np.random.uniform(0.2, 1.0)
        
        # Injury impact (simulated)
        injury_impact = np.random.uniform(0, 0.3)
        
        # Motivation index based on recent form and h2h
        motivation = (base_features[0] + base_features[2] * 0.5) / 1.5
        
        enhanced.extend([home_xg, away_xg, weather_factor, injury_impact, motivation])
        
        return enhanced[:len(self.feature_names)]  # Ensure correct length

    def predict(self, features):
        """Enhanced prediction with Kalshi + Pinnacle integration"""
        # Enhance features
        enhanced_features = self._enhance_features(features)
        features_array = np.array([enhanced_features])
        features_scaled = self.scaler.transform(features_array)
        
        # Get ensemble predictions
        rf_probs = self.rf_model.predict_proba(features_scaled)[0]
        gb_probs = self.gb_model.predict_proba(features_scaled)[0]
        lr_probs = self.lr_model.predict_proba(features_scaled)[0]
        
        # Weighted ensemble
        ensemble_probs = (
            rf_probs * self.model_weights['rf'] +
            gb_probs * self.model_weights['gb'] +
            lr_probs * self.model_weights['lr']
        )
        
        # Kalshi market analysis
        kalshi_probs = self.kalshi.calculate_market_probability(
            enhanced_features, 
            []  # Would be historical outcomes in production
        )
        
        # Convert to array format for Pinnacle
        kalshi_array = [
            kalshi_probs['home_win'],
            kalshi_probs['draw'],
            kalshi_probs['away_win']
        ]
        
        # Pinnacle sharp odds
        pinnacle_analysis = self.pinnacle.calculate_sharp_odds(
            kalshi_probs, enhanced_features
        )
        
        # Combine ML ensemble with market intelligence
        final_probs = (
            ensemble_probs * 0.6 +  # ML models
            np.array(kalshi_array) * 0.25 +  # Market intelligence
            np.array(list(pinnacle_analysis['probabilities'].values())) * 0.15  # Sharp odds
        )
        
        # Normalize
        final_probs = final_probs / np.sum(final_probs)
        
        prediction_index = np.argmax(final_probs)
        outcomes = ['home', 'draw', 'away']
        prediction = outcomes[prediction_index]
        
        # Enhanced MagajiCo confidence
        confidence = self._apply_magajico_filter_v2(final_probs, enhanced_features, pinnacle_analysis)
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'probabilities': {
                'home': float(final_probs[0]),
                'draw': float(final_probs[1]),
                'away': float(final_probs[2])
            },
            'market_analysis': {
                'kalshi_probabilities': kalshi_probs,
                'pinnacle_odds': pinnacle_analysis['odds'],
                'sharp_confidence': pinnacle_analysis['sharp_confidence'],
                'line_movement': pinnacle_analysis['line_movement']
            },
            'ensemble_breakdown': {
                'random_forest': {f'prob_{i}': float(rf_probs[i]) for i in range(3)},
                'gradient_boost': {f'prob_{i}': float(gb_probs[i]) for i in range(3)},
                'logistic_regression': {f'prob_{i}': float(lr_probs[i]) for i in range(3)},
                'weights': self.model_weights
            },
            'magajico_analysis': self._strategic_analysis_v2(enhanced_features, final_probs, pinnacle_analysis),
            'risk_metrics': self._calculate_risk_metrics(final_probs, pinnacle_analysis),
            'value_opportunities': self._identify_value_bets(final_probs, pinnacle_analysis['odds'])
        }

    def _apply_magajico_filter_v2(self, probabilities, features, pinnacle_data):
        """Enhanced MagajiCo 5(1) filter with market intelligence"""
        base_confidence = np.max(probabilities)
        
        # Enhanced 5 Quality Checks:
        # 1. Model consensus (ensemble agreement)
        model_consensus = 1.0 - np.std(probabilities) * 2
        
        # 2. Market validation (Kalshi-style)
        market_validation = pinnacle_data['sharp_confidence']
        
        # 3. Sharp money confirmation (Pinnacle-style)
        sharp_confirmation = min(1.0, pinnacle_data['sharp_confidence'] + abs(pinnacle_data['line_movement']) * 0.5)
        
        # 4. Feature quality score
        feature_quality = np.mean(features[:7]) * 0.8 + (1 - np.std(features[:7])) * 0.2
        
        # 5. Risk-adjusted confidence
        risk_factor = 1 - (np.std(probabilities) + abs(pinnacle_data['line_movement']) * 0.5) / 2
        
        # Combined confidence with market intelligence
        enhanced_confidence = min(1.0, 
            base_confidence * 0.4 +
            model_consensus * 0.15 +
            market_validation * 0.15 +
            sharp_confirmation * 0.15 +
            feature_quality * 0.08 +
            risk_factor * 0.07
        )
        
        return enhanced_confidence

    def _strategic_analysis_v2(self, features, probabilities, pinnacle_data):
        """Enhanced CEO-level analysis with market intelligence"""
        max_prob = np.max(probabilities)
        
        return {
            'innovation_score': min(100, int(max_prob * 130)),
            'market_position': self._determine_market_position(max_prob, pinnacle_data['sharp_confidence']),
            'risk_level': self._calculate_risk_level(probabilities, pinnacle_data),
            'execution_confidence': int(max_prob * pinnacle_data['sharp_confidence'] * 100),
            'market_efficiency': int(pinnacle_data['sharp_confidence'] * 100),
            'value_detection': self._detect_value_opportunity(probabilities, pinnacle_data['odds']),
            'line_movement_impact': abs(pinnacle_data['line_movement']) * 100,
            'smart_money_indicator': pinnacle_data['sharp_confidence'] > 0.7
        }
    
    def _determine_market_position(self, prob, sharp_confidence):
        """Determine market position based on probability and sharp money"""
        if prob > 0.8 and sharp_confidence > 0.75:
            return 'market_leader'
        elif prob > 0.7 and sharp_confidence > 0.6:
            return 'strong_position'
        elif prob > 0.6:
            return 'competitive'
        else:
            return 'uncertain'
    
    def _calculate_risk_level(self, probs, pinnacle_data):
        """Calculate risk level with market factors"""
        prob_variance = np.var(probs)
        line_movement_risk = abs(pinnacle_data['line_movement']) * 0.5
        
        total_risk = prob_variance + line_movement_risk
        
        if total_risk < 0.1:
            return 'low'
        elif total_risk < 0.2:
            return 'medium'
        else:
            return 'high'
    
    def _calculate_risk_metrics(self, probs, pinnacle_data):
        """Calculate comprehensive risk metrics"""
        return {
            'probability_variance': float(np.var(probs)),
            'market_volatility': abs(pinnacle_data['line_movement']),
            'confidence_spread': float(np.max(probs) - np.min(probs)),
            'sharp_money_risk': 1 - pinnacle_data['sharp_confidence'],
            'overall_risk_score': float(np.var(probs) + abs(pinnacle_data['line_movement']) * 0.5)
        }
    
    def _identify_value_bets(self, model_probs, market_odds):
        """Identify value betting opportunities"""
        value_opportunities = []
        outcomes = ['home', 'draw', 'away']
        
        for i, outcome in enumerate(outcomes):
            model_prob = model_probs[i]
            market_odd = market_odds[outcome + '_win' if outcome != 'draw' else outcome]
            implied_prob = 1 / market_odd if market_odd > 0 else 0
            
            if model_prob > implied_prob * 1.1:  # 10% edge threshold
                edge = (model_prob - implied_prob) / implied_prob
                value_opportunities.append({
                    'outcome': outcome,
                    'edge_percentage': float(edge * 100),
                    'model_probability': float(model_prob),
                    'market_probability': float(implied_prob),
                    'recommended_odds': float(market_odd),
                    'confidence_level': 'high' if edge > 0.2 else 'medium'
                })
        
        return value_opportunities
    
    def _detect_value_opportunity(self, probs, odds):
        """Detect if there's a significant value opportunity"""
        value_bets = self._identify_value_bets(probs, odds)
        
        if not value_bets:
            return 'no_value'
        
        max_edge = max(bet['edge_percentage'] for bet in value_bets)
        
        if max_edge > 20:
            return 'high_value'
        elif max_edge > 10:
            return 'medium_value'
        else:
            return 'low_value'

if __name__ == "__main__":
    try:
        features = json.loads(sys.argv[1])
        predictor = MagajiCoMLPredictor()
        result = predictor.predict(features)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)