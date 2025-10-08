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

The application is configured for production deployment:

**Backend (Render)**:
- Deployment config: `render.yaml`
- Build: `npm install -g pnpm && pnpm install && cd apps/backend && pnpm run build`
- Start: `cd apps/backend && pnpm start`
- Port: 10000 (set via environment variable)
- Host: 0.0.0.0 (production), localhost (development)

**Frontend (Vercel)**:
- Deployment config: `apps/frontend/vercel.json`
- Build: `pnpm install && cd apps/frontend && pnpm build`
- Output: `apps/frontend/.next`
- Framework: Next.js
- API rewrites configured for backend integration

See `DEPLOYMENT.md` for detailed deployment instructions.

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

## Notes
- The app gracefully handles missing MongoDB connection
- Service Worker is registered for PWA functionality
- Cross-origin requests are configured for Replit's iframe proxy
- The frontend uses 0.0.0.0:5000 to work with Replit's preview system
