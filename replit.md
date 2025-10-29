## Overview
Sports Central is a production-ready monorepo sports prediction and community platform built with Next.js (Frontend), Fastify (Backend), and FastAPI (ML Service). It features AI-powered predictions, live scores, interactive experiences, and community rewards. The platform provides a comprehensive multi-sport experience inspired by FlashScore, incorporating real-time data, personalized content, and engaging user interfaces. Key capabilities include multi-sport browsing, live scorecards with AI insights, an authentication system with age verification, and Kids Mode for educational sports content. The project aims to offer a robust, engaging, and AI-powered sports hub.

## Recent Changes
**October 29, 2025**: Enhanced Interactive Features Implementation
- Fully integrated SearchBar, HelpCenter, SettingsPanel, and UserProfileDropdown into GoogleNavBar with proper state management
- Updated main page to use EnhancedLiveCarousel instead of regular LiveCarousel for auto-scroll and pause-on-hover functionality
- All interactive modals now properly wired with backdrop click handlers and smooth animations
- Fixed Next.js revalidate export issue that was causing runtime errors
- Verified all enhanced animations (shimmer, scale-in, fade-in) are functioning correctly
- All changes architect-reviewed and approved with zero critical issues

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
- Google-style navigation bar with Magajico app drawer launcher showing 9 feature apps: Portal, Predictions, Live, Social, Kids Mode, Rewards, Analytics, Chat, Challenges.
- Homepage features horizontal carousels for Live Matches and Latest News with auto-scrolling functionality.
- Feature app cards with gradient backgrounds and hover effects for intuitive navigation.
- All navigation is locale-aware using Next.js `[locale]` routing structure (e.g., `/en/matches`, `/en/empire`).
- Feature-based organization with dedicated route groups (e.g., `(predictions)`, `(social)`, `(rewards)`).

**Technical Implementations:**
- Robust authentication system with age verification.
- Real-time data processing for live scores.
- AI-powered prediction models.
- Modular architecture with feature-based apps for maintainability.
- Locale-aware routing throughout the application using Next.js App Router with `[locale]` parameter.
- Client-side React hooks (useState, useParams) properly implemented with "use client" directives.
- Shared UI components: GoogleNavBar, Magajico AppDrawer, EnhancedLiveCarousel, SearchBar, HelpCenter, SettingsPanel, UserProfileDropdown.
- Advanced CSS animations including shimmer effects, scale-in transitions, pulsing badges, and hover effects.
- Environment variables are strictly configured for different services and environments.

## External Dependencies
- **MongoDB Atlas**: Used as the primary database for persistence.
- **Stripe**: Integrated for payment processing (currently in test mode).
- **scikit-learn**: Python library for machine learning models within the FastAPI ML Service.