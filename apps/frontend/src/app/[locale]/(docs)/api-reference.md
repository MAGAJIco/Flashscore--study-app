
# API REFERENCE

**Base URL**: `https://your-domain.replit.dev/api`

## Authentication

Most endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## Predictions API

### GET /api/predictions
- **Description**: Retrieve ML-powered match predictions
- **Response**: `{ predictions: [...], confidence: 87% }`
- **Auth**: Required

### POST /api/predictions
- **Description**: Create new prediction
- **Body**: `{ matchId, prediction, confidence }`
- **Response**: `{ id, status, result }`

## Live Matches API

### GET /api/matches/live
- **Description**: Get real-time live match data
- **Response**: `{ matches: [...], status: 'live' }`
- **Auth**: Optional

### GET /api/matches/today
- **Description**: Get today's scheduled matches
- **Response**: `{ matches: [...], total: 25 }`

## News API

### GET /api/news/latest
- **Description**: Fetch latest sports news
- **Query**: `?limit=10&category=football`
- **Response**: `{ news: [...], total: 25 }`

### POST /api/news
- **Description**: Create news article (Authors only)
- **Body**: `{ title, content, category, authorId }`
- **Auth**: Required (Author role)

## ML Service API

### GET /api/ml/health
- **Description**: Check ML service health
- **Response**: `{ status: 'healthy', model_loaded: true }`

### POST /api/ml/predict
- **Description**: Get ML prediction for match
- **Body**: `{ matchId, homeTeam, awayTeam, features }`
- **Response**: `{ prediction, confidence, analysis }`

### POST /api/ml/train
- **Description**: Trigger model training (Admin only)
- **Body**: `{ dataset, epochs }`
- **Auth**: Required (Admin)

## User Management

### POST /api/auth/register
- **Description**: Register new user
- **Body**: `{ username, email, password }`
- **Response**: `{ user, token }`

### POST /api/auth/login
- **Description**: User login
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

### GET /api/preferences
- **Description**: Get user preferences
- **Auth**: Required
- **Response**: `{ theme, language, notifications }`

## Rate Limits

- **Anonymous**: 60 requests/hour
- **Authenticated**: 600 requests/hour
- **Premium**: 6000 requests/hour

## Error Codes

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error
