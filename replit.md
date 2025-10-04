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
Configured for **autoscale** deployment:
- Build: `pnpm install && cd apps/frontend && pnpm build`
- Run: `cd apps/frontend && pnpm start`
- Production port: 5000

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
