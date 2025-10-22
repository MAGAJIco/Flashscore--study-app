# Deployment Guide - Sports Central

This guide covers deploying the Sports Central application to Render (backend services) and Vercel (frontend).

## Architecture Overview

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: Fastify API deployed on Render
- **ML Service**: FastAPI service deployed on Render
- **Database**: MongoDB (configure your own instance)

---

## 📦 Prerequisites

Before deploying, ensure you have:

1. A [Render](https://render.com) account
2. A [Vercel](https://vercel.com) account  
3. A MongoDB instance (MongoDB Atlas recommended)
4. Environment variables ready (see below)

---

## 🚀 Render Deployment (Backend + ML Service)

### Step 1: Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub/GitLab repository
4. Render will detect `render.yaml` automatically

### Step 2: Configure Environment Variables

Set these environment variables in Render for **magajico-backend**:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportscentral
FRONTEND_URL=https://your-app.vercel.app
ML_SERVICE_URL=https://magajico-ml-service.onrender.com
PORT=3001
```

Set these environment variables for **magajico-ml-service**:

```bash
PYTHON_VERSION=3.11.0
MODEL_PATH=model_data.pkl
ENVIRONMENT=production
FRONTEND_URL=https://your-app.vercel.app
```

### Step 3: Deploy

- Render will automatically build and deploy both services
- Wait for builds to complete (~3-5 minutes each)
- Note down the URLs:
  - Backend: `https://magajico-backend.onrender.com`
  - ML Service: `https://magajico-ml-service.onrender.com`

### Health Check Endpoints

- Backend: `https://magajico-backend.onrender.com/health`
- ML Service: `https://magajico-ml-service.onrender.com/health`

---

## 🌐 Vercel Deployment (Frontend)

### Step 1: Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Build Settings

Vercel should detect these from `vercel.json`:

- **Build Command**: `npm run build --workspace=packages/shared && npm run build --workspace=apps/frontend`
- **Install Command**: `npm ci`
- **Output Directory**: `apps/frontend/.next`
- **Framework**: Next.js

### Step 3: Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```bash
# Backend API URL (from Render)
NEXT_PUBLIC_API_URL=https://magajico-backend.onrender.com

# ML Service URL (from Render)
NEXT_PUBLIC_ML_URL=https://magajico-ml-service.onrender.com

# MongoDB Connection (for Next.js API routes)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportscentral

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### Step 4: Deploy

- Click "Deploy"
- Wait for build to complete (~2-3 minutes)
- Your app will be live at `https://your-app.vercel.app`

---

## 🔄 API Proxy Configuration

The frontend proxies backend API calls through Vercel. This is configured in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/backend/:path*",
      "destination": "https://magajico-backend.onrender.com/api/:path*"
    },
    {
      "source": "/api/ml/:path*",
      "destination": "https://magajico-ml-service.onrender.com/:path*"
    }
  ]
}
```

This means:
- Frontend calls `/api/backend/matches` → Proxied to `https://magajico-backend.onrender.com/api/matches`
- Frontend calls `/api/ml/predict` → Proxied to `https://magajico-ml-service.onrender.com/predict`

---

## 📊 Database Setup (MongoDB Atlas)

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (Free tier M0 is fine for development)
3. Create a database user with read/write permissions
4. Whitelist your IP addresses (or use `0.0.0.0/0` for all - not recommended for production)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sportscentral
   ```
6. Add this as `MONGODB_URI` in both Render and Vercel

---

## 🧪 Testing Deployment

### Test Backend API

```bash
curl https://magajico-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "magajico-backend",
  "timestamp": "2025-10-22T10:30:00Z"
}
```

### Test ML Service

```bash
curl https://magajico-ml-service.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "3.0.0"
}
```

### Test Frontend

Visit `https://your-app.vercel.app` and verify:
- Page loads correctly
- API calls to backend work
- Predictions are being fetched

---

## 🔒 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Configure MongoDB IP whitelist (don't use `0.0.0.0/0` in production)
- [ ] Enable CORS only for your frontend domain in production
- [ ] Use environment variables for all secrets (never commit to Git)
- [ ] Enable Vercel password protection during development
- [ ] Set up proper database backups in MongoDB Atlas

---

## 🐛 Troubleshooting

### Backend Won't Start on Render

**Error**: `Cannot find module 'mongoose'`
- **Solution**: Check `buildCommand` includes `npm install`

**Error**: `MONGODB_URI is not defined`
- **Solution**: Add `MONGODB_URI` environment variable in Render

### ML Service Fails

**Error**: `ModuleNotFoundError: No module named 'sklearn'`
- **Solution**: Verify `requirements.txt` is in `apps/backend/ml/` directory
- Ensure `buildCommand` has correct path

### Frontend Can't Connect to Backend

**Error**: `Failed to fetch`
- **Solution**: Check backend URL is correct in Vercel environment variables
- Verify CORS is enabled in backend
- Check `vercel.json` rewrites configuration

### Build Fails on Vercel

**Error**: `Cannot find module '@magajico/shared'`
- **Solution**: Ensure shared package builds first in build command
- Check `transpilePackages: ["@magajico/shared"]` in `next.config.js`

---

## 📝 Post-Deployment

1. **Update URLs**: After deployment, update any hardcoded URLs in your code
2. **Monitor Logs**: Check Render and Vercel logs for errors
3. **Test All Features**: Run through all major user flows
4. **Set Up Monitoring**: Configure uptime monitoring (UptimeRobot, Pingdom, etc.)
5. **Database Indexes**: Ensure MongoDB indexes are created for performance

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

- **Push to `main` branch** → Auto-deploy to production
- **Push to other branches** → Create preview deployments (Vercel)

Configure branch settings in each platform's dashboard.

---

## 📞 Support

- Render Issues: [Render Support](https://render.com/docs)
- Vercel Issues: [Vercel Support](https://vercel.com/docs)
- MongoDB Issues: [MongoDB Support](https://www.mongodb.com/docs/atlas/)

---

## 📌 Quick Reference

| Service | Platform | URL Pattern | Health Check |
|---------|----------|-------------|--------------|
| Frontend | Vercel | `your-app.vercel.app` | `/` |
| Backend | Render | `magajico-backend.onrender.com` | `/health` |
| ML Service | Render | `magajico-ml-service.onrender.com` | `/health` |
| Database | MongoDB Atlas | `cluster0.xxxxx.mongodb.net` | N/A |
