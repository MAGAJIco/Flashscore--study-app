# Sports Central - Replit Setup

## Overview
Sports Central is a premium monorepo sports prediction and community platform built with Next.js. It features AI-powered predictions, live scores, interactive experiences, and community rewards. The platform aims to provide a comprehensive multi-sport experience inspired by FlashScore, incorporating real-time data, personalized content, and engaging user interfaces. Key capabilities include multi-sport browsing, live scorecards with AI insights, an authentication system with age verification, and a Kids Mode for educational sports content.

## Recent Changes (October 23, 2025)
- **Deployment Configuration Fixes**: Fixed critical deployment errors for both Render and Vercel platforms
  - Fixed `render.yaml`: Changed invalid service type from emoji to `web`, updated Python version to `3.11.13`
  - Updated `vercel.json`: Improved monorepo build order to ensure shared packages build first
  - Enhanced `DEPLOY.md`: Added complete ML service environment variables documentation
  - Created comprehensive `.env.example`: Documented all required environment variables for all services
- **TypeScript Compilation Fixes**: Resolved all backend build errors for production deployment
  - Updated `User.ts` model: Added missing `password` and `role` fields to support authentication
  - Fixed `jwtUtils.ts`: Implemented dynamic token expiration parsing from environment variables with `parseTimeToSeconds()` helper
  - Corrected `auth.ts`: Fixed type conversion for MongoDB `_id` field using `String()` casting
  - Verified: Backend builds successfully without TypeScript errors (`npm run build` passes)
- **Frontend TypeScript Fixes**: Resolved Vercel deployment blocking errors
  - Fixed `CommunityVoting.tsx`: Changed static PiCoinManager calls to instance method calls via `getInstance()`
  - Fixed `ChallengeFriends.tsx`: Removed duplicate variable declaration
  - Replaced invalid `addTransaction()` static calls with proper instance methods (`spendCoins()`, `getBalance()`)
  - Verified: Frontend TypeScript compilation passes for deployment-blocking errors
- **Status**: All three workflows (Backend, Frontend, ML Service) running successfully in development environment

## User Preferences
I prefer simple language in explanations. I want iterative development, so please ask before making major changes. I prefer detailed explanations for complex features.

## System Architecture

### UI/UX Decisions
The platform features a clean, responsive design with a Day/Night theme system, inspired by FlashScore's aesthetic. It includes a multi-sport selector, bottom navigation for easy access to key sections (All Games, Live, Favorites, News, Leagues), and live scorecards with AI prediction overlays. Kids Mode offers a colorful, engaging UI with a badge collection system. iOS-style features like haptic feedback, pull-to-refresh, and bottom sheet modals enhance the native app-like experience.

### Technical Implementations
- **Monorepo Structure**: Organized into `apps/` (frontend, backend, ML service) and `packages/shared/` for shared utilities.
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS. Configured for SSR-safe theme initialization and Vercel deployment.
- **Backend**: Fastify (Node.js 20) with MongoDB (Mongoose). Architecture follows routes → services → models pattern. All 7 route modules registered and connected:
  - Health & Monitoring: `/health`, `/health/metrics`
  - Predictions: `/api/predictions/*` (ML-powered with mlPredictionService and aiEnhancementService)
  - Matches: `/api/matches/*` (MongoDB with scraperServices)
  - News: `/api/news/*` (MongoDB)
  - Authors: `/api/news-authors/*` (Service Layer)
  - Foundation: `/api/foundation/:userId` (MongoDB)
  - Errors: `/api/errors/*` (MongoDB)
- **ML Service**: Python 3.11, FastAPI, scikit-learn, PyTorch.
- **Authentication**: NextAuth for email/password and Google OAuth, JWT-based sessions, bcrypt password hashing, and COPPA-compliant age verification (13+ years required).
- **Security**: Environment variable validation, CORS enabled with credentials support, no hard-coded secrets.
- **Deployment**: Configured for zero-cost deployment via Render (backend + ML service using Blueprint) and Vercel (frontend). See DEPLOY.md for detailed deployment instructions.
- **Port Configuration**: Frontend (5000), Backend (3001), ML Service (8000).
- **Database Models**: Match, News, NewsAuthor, Prediction, User, Foundation, ErrorLog (all indexed and optimized).

### Feature Specifications
- **Authentication System**: Secure user registration, login, Google OAuth, JWT sessions, age verification for access restrictions (e.g., betting/payments blocked for minors).
- **FlashScore-Inspired Features**:
    - **Day/Night Theme System**: Light and dark modes with system preference detection and persistent selection.
    - **Multi-Sport Selector**: Browse various sports with icons, live game counts, favorites, and search.
    - **Bottom Navigation**: Five-tab system for All Games, Live, Favorites, News, and Leagues.
    - **Live Score Cards**: Real-time match display with live status, minute-by-minute progress, and AI predictions.
    - **Date Selector**: Navigate matches by date with quick filters (Today, Tomorrow, Yesterday).
    - **Leagues Browser**: Discover competitions by country with flag emojis and match counts.
- **Kids Mode Dashboard**: Interactive educational sports quizzes, achievement system with badges, and a safe learning environment compliant with COPPA.
- **Match Tracker**: Visual-only status indicators for live, halftime, completed, and upcoming matches, inspired by Flashscore.
- **iOS-Style Features**: Haptic feedback, pull-to-refresh, bottom sheet modals, and dark mode support.

## External Dependencies
- **Database**: MongoDB (configured with Mongoose).
- **Authentication**: NextAuth.js.
- **Deployment Platforms**: Vercel (frontend), Render (backend/ML service), Replit (for development and autoscale deployment).
- **CORS**: Dynamic CORS handling with environment variable support.