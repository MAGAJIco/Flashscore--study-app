
# SYSTEM ARCHITECTURE

## Frontend Structure

```
apps/frontend/src/app/[locale]/
├── (empire)/            # Empire Central (Command Center)
├── (predictions)/       # AI Predictions
├── (live)/             # Live tracking
├── (social)/           # Social features
├── (kids)/             # Kids mode
├── (rewards)/          # Achievements
└── (docs)/             # Documentation
```

## Backend Modules

```
apps/backend/src/modules/
├── predictions/         # Prediction service
├── matches/            # Live match service
├── social/             # Social features
├── rewards/            # Rewards system
└── kids/               # Kids mode enforcement
```

## Shared Packages

```
packages/shared/
├── libs/
│   ├── api/            # API client
│   ├── models/         # Shared data models
│   ├── services/       # Common services
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
```

## Technology Stack

- **Frontend**: Next.js 14.2, React 18, TypeScript
- **Backend**: Node.js, Fastify, TypeScript
- **Database**: MongoDB Atlas
- **ML Service**: Python, FastAPI, PyTorch
- **Styling**: Tailwind CSS, CSS Modules
- **State**: React Context, Local Storage
- **API**: REST + Real-time updates

## Deployment

- **Frontend**: Vercel/Replit
- **Backend**: Replit
- **ML Service**: Replit
- **Database**: MongoDB Atlas (Cloud)
