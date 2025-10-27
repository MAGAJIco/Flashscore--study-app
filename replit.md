## Overview
Sports Central is a production-ready monorepo sports prediction and community platform built with Next.js (Frontend), Fastify (Backend), and FastAPI (ML Service). It features AI-powered predictions, live scores, interactive experiences, and community rewards. The platform provides a comprehensive multi-sport experience inspired by FlashScore, incorporating real-time data, personalized content, and engaging user interfaces. Key capabilities include multi-sport browsing, live scorecards with AI insights, an authentication system with age verification, and Kids Mode for educational sports content. The project aims to offer a robust, engaging, and AI-powered sports hub.

## User Preferences
- **Coding Style**: Clean, modular, production-ready code
- **Architecture**: Feature-based monorepo structure
- **Documentation**: Comprehensive, up-to-date technical documentation
- **Quality**: No mock data, real service integrations, zero errors

## System Architecture
**Monorepo Structure:**
The project is organized as a monorepo with the following key directories:
- `apps/backend/`: Contains the Fastify REST API and an embedded FastAPI ML Service.
- `apps/frontend/`: Houses the Next.js 14 App Router application.
- `packages/shared/`: Stores shared TypeScript types and utilities for the monorepo.
- `recyclebin/`: For deprecated or unused components.
- `docs/`: Holds architectural and API documentation.

**Technology Stack:**
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS.
- **Backend**: Fastify, MongoDB, JWT Authentication.
- **ML Service**: FastAPI, scikit-learn 1.5.2, Python 3.x.
- **Database**: MongoDB Atlas.
- **Deployment**: Replit.

**UI/UX Decisions:**
- Comprehensive documentation page at `/docs` with Google-style UI.
- Interactive app launcher showing 9 feature apps: Portal, Predictions, Live, Social, Kids Mode, Rewards, Analytics, Chat, Challenges.
- Simplified homepage that imports and renders a `Welcome` component, with feature navigation consolidated into a `ComprehensiveSportsHub` component.
- Feature-based organization with dedicated route groups (e.g., `(predictions)`, `(social)`, `(rewards)`).

**Technical Implementations:**
- Robust authentication system with age verification.
- Real-time data processing for live scores.
- AI-powered prediction models.
- Modular architecture with feature-based apps for maintainability.
- Environment variables are strictly configured for different services and environments.

## External Dependencies
- **MongoDB Atlas**: Used as the primary database for persistence.
- **Stripe**: Integrated for payment processing (currently in test mode).
- **scikit-learn**: Python library for machine learning models within the FastAPI ML Service.