# Sports Central - Replit Setup

## Project Overview
Sports Central is a premium monorepo sports prediction and community platform built with Next.js, featuring AI-powered predictions, live scores, interactive experiences, and community rewards.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Fastify, Node.js 20, Express.js
- **ML Service**: Python 3.11, FastAPI, scikit-learn, PyTorch
- **Database**: MongoDB (configured with Mongoose)
- **Package Manager**: pnpm (monorepo with workspaces)

## Project Structure
```
magajico-monorepo/
├── apps/
│   ├── frontend/          # Next.js 14 app (Port 5000)
│   ├── backend/           # Fastify API (Port 3001)
│   │   └── ml/            # FastAPI ML service (Port 8000)
└── packages/
    └── shared/            # Shared utilities, types, models
```

## Replit Configuration

### Workflows
- **Frontend** (Port 5000): `cd apps/frontend && pnpm dev`
  - Serves the Next.js application on 0.0.0.0:5000
  - Configured with allowedDevOrigins for Replit proxy
  - WebView output type for browser preview

### Environment Variables
The app uses MongoDB for data persistence. Key environment variables:
- `MONGODB_URI`: MongoDB connection string (optional, app runs without DB)
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (default: http://localhost:3001)
- `NODE_ENV`: Environment mode (development/production)

Environment variables can be configured through Replit's Secrets panel.

### Deployment

The application is configured for Replit deployment with autoscale:

**Replit Deployment**:
- Build: `pnpm install && cd apps/frontend && pnpm build`
- Start: `cd apps/frontend && pnpm start`
- Port: 5000 (serves on 0.0.0.0)
- Deployment type: Autoscale (stateless Next.js app)
- Click the "Deploy" button in Replit to publish your app

**External Deployment Options** (optional):
- Backend can be deployed to Render using `render.yaml`
- Frontend previously configured for Vercel (see `apps/frontend/vercel.json`)

## Development

### Running the App
The frontend workflow is already configured and runs automatically on port 5000.

### Installing Dependencies
```bash
pnpm install
```

### Building for Production
```bash
cd apps/frontend && pnpm build
```

### Backend and ML Services (Optional)
These services are currently optional and can be started separately:
```bash
# Backend (Port 3001)
cd apps/backend && pnpm dev

# ML Service (Port 8000)
cd apps/backend/ml && python main.py
```

## Port Configuration
- **Frontend (Next.js)**: Port 5000 (0.0.0.0)
- **Backend (Fastify)**: Port 3001 (localhost)
- **ML Service (FastAPI)**: Port 8000 (0.0.0.0)

## Recent Changes
- **2025-10-12**: Migrated project from Vercel to Replit
  - Successfully installed all pnpm dependencies (1381 packages)
  - Configured frontend workflow on port 5000 with 0.0.0.0 binding
  - Set up Replit autoscale deployment configuration
  - Updated deployment documentation for Replit environment
  - Frontend running successfully with Next.js 14.2.33
  - Application verified working with live scores, authors, and news display

- **2025-10-09**: Fixed all TypeScript compilation errors for Render production deployment
  - **Fixed 18 TypeScript build errors** across 7 files that were preventing Render deployment
  - **main.ts**: Fixed error.statusCode type errors with proper type casting
  - **Fastify logger fixes**: Updated all fastify.log.error() calls to use correct format `{ err: error }, 'message'`
  - **NewsAuthorService**: Corrected import to use static methods (NewsAuthorService.getActiveAuthors)
  - **health.ts**: Removed unused node-fetch import (using Node.js 20 native fetch)
  - **Service type fixes**: Added proper type annotations in aiEnhancementService and statAreaService
  - **Commented out missing collaborationService** to avoid build errors while preserving intent
  - **Production build now passes**: `pnpm run build` completes successfully with zero errors
  - **Runtime verified**: Backend running successfully on port 3001 with no errors

- **2025-10-08**: Enhanced payment processing with age-based restrictions
  - Implemented comprehensive age verification for all payment operations
  - Added age verification middleware (apps/backend/src/middleware/ageVerification.ts)
  - Enhanced payment controller with age checks and minor transaction limits
  - Updated frontend payment API to validate user age before processing
  - Age restrictions: Under 13 blocked, 13-17 require parental consent, 18+ full access
  - Transaction limits: $50 maximum per transaction for minors with consent
  - Error codes: AGE_RESTRICTION_UNDERAGE, PARENTAL_CONSENT_REQUIRED, MINOR_AMOUNT_LIMIT_EXCEEDED
  - Age verification metadata included in Stripe payment intents

- **2025-10-06**: Project cleanup and shared package setup
  - Created packages/shared/src/index.ts as central export barrel
  - Properly exported all utilities, models, services, and types from shared package
  - Resolved ApiResponse type conflict between apifoundation and types modules
  - Added explicit default exports for all modules (PiCoinManager, UserManager, etc.)
  - Cleaned up root directory: moved unused scripts to recyclebin (server.js, start-*.sh, dockerfile)
  - Removed duplicate empty CacheManager.ts file
  - Installed all pnpm dependencies (997 packages)
  - Frontend workflow running successfully on port 5000

- **2025-10-06**: Deployment configuration
  - Configured backend for Render deployment with pnpm
  - Configured frontend for Vercel deployment
  - Implemented dynamic CORS with environment variable support
  - Added URL normalization for CORS origins (handles trailing slashes)
  - Created comprehensive deployment guide (DEPLOYMENT.md)
  - Added clean .env.example files for both frontend and backend
  
- **2025-10-04**: Initial Replit setup
  - Installed Node.js 20 and Python 3.11 modules
  - Configured Next.js to allow Replit dev origins
  - Updated all port 3000 references to 3001 for backend
  - Set up Frontend workflow on port 5000
  - Configured autoscale deployment
  - Added .gitignore patterns for Node.js and Python

## Security Notes
- **CORS is configured with allowlist**: Only specific origins are allowed (no permissive `origin: true`)
- **MongoDB is optional in development**: App runs without database for local testing
- **Production database enforcement**: Set `REQUIRE_DB=true` or `NODE_ENV=production` to require database
- Service Worker is registered for PWA functionality
- The frontend uses 0.0.0.0:5000 to work with Replit's preview system

## Important Environment Variables
Before deploying to production, ensure these are set:
- `FRONTEND_URL`: The frontend URL for CORS validation
- `REPLIT_DEV_DOMAIN`: Automatically detected, but verify it's correct
- `REQUIRE_DB`: Set to 'true' in production to enforce database connection
- `NODE_ENV`: Set to 'production' for production deployments
- `MONGODB_URI`: Your MongoDB connection string
