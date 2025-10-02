# Sports Central - Live Sports Predictions & Community Platform

## Overview

Sports Central is a premium monorepo built with cutting-edge technology that delivers AI-powered sports predictions, live scores, interactive experiences, and community rewards with Pi cryptocurrency integration. The platform combines machine learning analytics with social features to create a comprehensive sports engagement ecosystem.

The application is designed as a full-stack platform featuring real-time sports data, intelligent predictions, community voting, gamified quizzes, and a cryptocurrency rewards system. It includes a Progressive Web App (PWA) with offline capabilities and a browser extension for enhanced user engagement across sports websites.

## Recent Changes

### Replit Environment Setup (October 2, 2025)
- Successfully configured monorepo for Replit environment with pnpm workspaces
- All dependencies installed using pnpm (root, frontend, backend, shared packages)
- **Node.js 20** and **Python 3.11** modules installed
- Python ML dependencies installed (FastAPI, scikit-learn, pandas, etc.)
- Frontend running on port 5000 (0.0.0.0) for public access through Replit proxy
- Backend API running on port 3001 (localhost) for internal API calls
- ML service running on port 8000 (0.0.0.0) for prediction endpoints
- Next.js configured with `allowedDevOrigins: ['*']` for Replit proxy support
- TypeScript backend configuration fixed with Node.js type definitions
- Created start-dev.sh script to run frontend, backend, and ML services together
- Workflow configured to start all services with frontend on port 5000
- Deployment configured for **autoscale** (stateless Next.js deployment)
- .gitignore updated with Node.js and Python-specific entries
- Application successfully tested and running in Replit environment

### Important Notes
- **Database**: MongoDB connection is optional - backend will run without it but with limited functionality
- **Routes**: Most backend routes are commented out pending database configuration
- **Package Manager**: Uses pnpm for workspace management (not npm or yarn)
- **Development**: Frontend, backend, and ML service all start together via start-dev.sh script
- **Environment Variables**: MONGODB_URI needed to enable full backend functionality
- **ML Service**: Python FastAPI service provides prediction endpoints at port 8000
- **Deployment**: Configured for autoscale deployment with Next.js production build

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14+ with TypeScript for server-side rendering and optimal performance
- **UI Components**: React 18 with custom component library featuring iPhone-inspired design
- **Styling**: Tailwind CSS with custom gradient themes and responsive design system
- **State Management**: React hooks with local storage utilities for data persistence
- **Offline Support**: Service Worker implementation with PWA capabilities
- **Real-time Updates**: WebSocket integration for live scores and notifications

### Backend Architecture
- **API Server**: Fastify framework for high-performance HTTP handling
- **Database**: MongoDB with Mongoose ODM for flexible data modeling
- **Machine Learning**: Python-based prediction engine with PyTorch models
- **Real-time Communication**: Socket.io for live updates and chat functionality
- **Data Scraping**: Cheerio-based web scrapers for sports data aggregation
- **Error Handling**: Comprehensive logging system with error categorization

### Data Storage Solutions
- **Primary Database**: MongoDB for user data, predictions, matches, and community content
- **Local Storage**: Browser-based storage for user preferences and offline data
- **Caching**: In-memory caching for frequently accessed data with TTL management
- **File Storage**: Static asset management for images and media content

### Authentication and Authorization
- **Authentication**: NextAuth.js integration with MongoDB adapter
- **User Management**: Role-based access control with user levels and permissions
- **Security**: bcryptjs for password hashing and secure session management
- **Account Recovery**: Custom recovery system with secure code generation

### Machine Learning Pipeline
- **Prediction Engine**: Python-based ML models using scikit-learn and PyTorch
- **Feature Engineering**: Team statistics, form analysis, and head-to-head data processing
- **Model Training**: Automated training pipeline with historical match data
- **Confidence Scoring**: Multi-factor confidence calculation for prediction accuracy

### Monorepo Structure
- **Apps Directory**: Separate frontend and backend applications with independent deployment
- **Packages Directory**: Shared utilities, types, and models across applications
- **Browser Extension**: Standalone Chrome extension for sports website integration
- **Path Aliases**: Organized import structure with TypeScript path mapping

## External Dependencies

### Sports Data APIs
- Custom web scraping services for live match data from sports websites
- Stake.com odds integration for betting information
- StatArea predictions aggregation for enhanced analysis
- Real-time score feeds with automatic data synchronization

### Cryptocurrency Integration
- Pi Network integration for rewards and payment processing
- Native cryptocurrency wallet support for Pi coin transactions
- Automated reward distribution system based on user engagement
- Withdrawal processing with offline queue management

### Third-party Services
- MongoDB Atlas for cloud database hosting with connection pooling
- Vercel deployment platform with optimized build configuration
- Email services for notifications and account management
- Push notification services for real-time alerts

### Development Tools
- TypeScript for type safety across the entire codebase
- ESLint and Prettier for code quality and formatting
- Jest testing framework for unit and integration tests
- Docker support for containerized development environments

### Browser Extension Ecosystem
- Chrome Extension Manifest V3 for modern browser integration
- Content script injection for sports website enhancement
- Background service workers for continuous data updates
- Cross-origin communication with main application API