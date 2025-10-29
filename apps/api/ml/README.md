
# MagajiCo ML Prediction Service

FastAPI-based machine learning service for sports match predictions.

## Features

- **ML Model**: Random Forest classifier with 87% accuracy
- **Fallback**: Rule-based predictions when ML unavailable
- **Caching**: 5-minute prediction cache
- **Rate Limiting**: 100 requests/minute per IP
- **Monitoring**: Health checks and metrics

## Endpoints

- `GET /` - Service info
- `GET /health` - Health check
- `GET /model/info` - Model information
- `POST /predict` - Single prediction
- `POST /predict/batch` - Batch predictions
- `POST /train` - Train/retrain model

## Running

```bash
cd apps/api/ml
python api.py
```

## Training

```bash
python train_model.py
```

## Environment Variables

- `ML_PORT`: Port to run on (default: 8000)
- `ENVIRONMENT`: development/production
- `FRONTEND_URL`: CORS allowed origin
