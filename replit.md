# Sports Central - Replit Project Documentation

## Project Overview
Sports Central is a premium monorepo sports prediction and community platform built with Next.js frontend and Node.js/TypeScript backend. The application provides AI-powered sports predictions, live scores, interactive quizzes, and Pi cryptocurrency integration.

## Project Architecture
- **Monorepo Structure**: Uses pnpm workspace for managing multiple packages
- **Frontend**: Next.js 14 with TypeScript (port 5000)
- **Backend**: Fastify/Express.js with TypeScript (port 8000)
- **Shared**: Common types, utilities, and models

## Recent Changes (Project Import Setup)
**Date**: September 26, 2025

### Configuration Updates Made:
1. **Dependencies**: Installed all pnpm dependencies across workspace
2. **TypeScript Config**: Fixed backend tsconfig.json to use ESNext modules (matching package.json type: "module")
3. **Host Configuration**: Verified frontend runs on 0.0.0.0:5000 and backend on 0.0.0.0:8000
4. **Next.js Config**: Added `allowedDevOrigins: ['127.0.0.1']` for Replit proxy compatibility
5. **Deployment**: Configured for autoscale deployment with proper build and run commands
6. **CSP Headers**: Already configured for Replit domains (*.replit.dev, *.replit.com)

### Workflows Configured:
- **Frontend**: `cd apps/frontend && pnpm dev` (port 5000)
- **Backend**: `cd apps/backend && pnpm dev` (port 8000)

### Working Status:
✅ Frontend: Running successfully with Next.js dev server
✅ Backend: Running successfully with Fastify server
⚠️  MongoDB: Connection failing (using local development fallback)

### Known Issues:
- React warnings about `iOSInterface` component casing and props (`showStatusBar`, `enableHapticFeedback`)
- Missing PWA icons (404s for icon files)
- MongoDB connection requires setup (currently gracefully degrading)

## User Preferences
- Prefers modern, clean development setup
- Values working applications over perfect code
- Appreciates comprehensive documentation

## Database Configuration
The application supports both MongoDB Atlas and local MongoDB connections via environment variables. Currently running without database connection in development mode.

## API Integrations
The project includes integrations for:
- Sports data APIs
- Pi Network cryptocurrency
- Authentication services
- Real-time data services

## Deployment Configuration
Configured for Replit autoscale deployment:
- Build: `pnpm build`
- Run: `pnpm start`
- Target: `autoscale` (stateless web application)