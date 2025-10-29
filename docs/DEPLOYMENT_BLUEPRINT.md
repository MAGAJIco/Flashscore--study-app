
# 🚀 Deployment Blueprint - MagajiCo

Complete deployment guide for all platforms with shared package integration.

## 📋 Build Order (Critical)

**Always build in this order:**
1. `packages/shared` - Core types and utilities
2. `apps/api` - Backend API (depends on shared)
3. `apps/web` - Frontend (depends on shared)

## 🎯 Platform-Specific Deployments

### 1. Replit Deployment (Recommended)

**Advantages:**
- Zero configuration needed
- Both frontend and backend on same platform
- Free tier available
- Instant preview URLs

**Steps:**
1. Click "Deploy" button in Replit workspace
2. Select "Autoscale Deployment" for web apps
3. Configure:
   - Build command: `npm run build --workspace=packages/shared && npm run build --workspace=apps/web`
   - Run command: `cd apps/web && npm start`
   - Port: 5000
4. Add environment variables (see `.env.example`)
5. Deploy!

**Environment Variables:**
```bash
NODE_ENV=production
MONGODB_URI=<your-mongodb-uri>
BACKEND_API_URL=<your-backend-url>
```

### 2. Vercel Deployment (Frontend Only)

**Configuration:** Already set in `vercel.json`

**Build Command:**
```bash
npm run build --workspace=packages/shared && npm run build --workspace=apps/web
```

**Deploy Steps:**
1. Push to GitHub
2. Import project in Vercel
3. Vercel auto-detects Next.js
4. Set environment variables
5. Deploy

**Required Environment Variables:**
```bash
NEXT_PUBLIC_BACKEND_URL=<backend-api-url>
MONGODB_URI=<mongodb-connection-string>
NEXTAUTH_URL=<your-vercel-url>
NEXTAUTH_SECRET=<generated-secret>
```

### 3. Render Deployment (Backend + ML)

**Configuration:** Already set in `render.yaml`

**Deploy Steps:**
1. Push to GitHub
2. Create new Blueprint in Render
3. Connect repository
4. Render auto-deploys both services:
   - `magajico-backend` (API)
   - `magajico-ml-service` (ML predictions)
5. Set environment variables
6. Deploy

**Required Environment Variables (Backend):**
```bash
MONGODB_URI=<mongodb-uri>
FRONTEND_URL=<vercel-or-replit-url>
ML_SERVICE_URL=https://magajico-ml-service.onrender.com
JWT_SECRET=<random-secret>
ENCRYPTION_KEY=<random-secret>
```

## 🔧 Local Build Verification

Run the verification script:
```bash
chmod +x scripts/verify-builds.sh
./scripts/verify-builds.sh
```

## 📦 Shared Package Integration

The shared package (`packages/shared`) contains:
- Type definitions (Match, News, Prediction, User)
- Utilities (formatters, validators, date helpers)
- Services (analytics, parental controls)

**Import in apps:**
```typescript
// In apps/web or apps/api
import { Match, formatDate, validateAge } from '@magajico/shared';
```

## 🎯 Deployment Checklist

- [ ] Shared package builds successfully
- [ ] API builds successfully
- [ ] Web builds successfully
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Health checks passing
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled

## 🐛 Common Issues

**Issue:** "Cannot find module '@magajico/shared'"
**Fix:** Build shared package first: `npm run build --workspace=packages/shared`

**Issue:** "Module not found" during build
**Fix:** Run `npm install` in root directory

**Issue:** API can't connect to MongoDB
**Fix:** Check `MONGODB_URI` environment variable and IP whitelist

## 📊 Cost Breakdown

| Platform | Service | Monthly Cost |
|----------|---------|--------------|
| Replit | Full Stack | $0 (Free tier) |
| Vercel | Frontend | $0 (Hobby) |
| Render | Backend + ML | $0 (Free tier) |
| MongoDB Atlas | Database | $0 (M0 tier) |

## 🔗 Resources

- [Replit Deployments](https://docs.replit.com/hosting/deployments/about-deployments)
- [Vercel Deployment](https://vercel.com/docs)
- [Render Blueprint](https://render.com/docs/blueprint-spec)
