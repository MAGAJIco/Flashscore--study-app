# 🚀 Deployment Guide - Sports Central

Quick guide to deploy Sports Central at **zero cost** using Render (backend) and Vercel (frontend).

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free, no credit card)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free, no credit card)
4. **MongoDB Atlas** - Free tier database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 🔧 Step 1: Setup MongoDB (Free Tier)

1. Create a MongoDB Atlas account
2. Create a new cluster (select **M0 Free** tier)
3. Create database user with username/password
4. Whitelist all IPs: `0.0.0.0/0` (or specific IPs for better security)
5. Copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sportscentral
   ```

---

## 🖥️ Step 2: Deploy Backend to Render (Zero Cost)

### Option A: Using Blueprint (Recommended - Deploys Both Services)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint**
4. Connect your GitHub repo
5. Render auto-detects `render.yaml` and creates both services:
   - `magajico-backend` (Fastify/Node.js)
   - `magajico-ml-service` (FastAPI/Python)

### Environment Variables to Set

For **magajico-backend**:

**Required:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportscentral
FRONTEND_URL=https://your-app.vercel.app
ML_SERVICE_URL=https://magajico-ml-service.onrender.com
```

**Security Secrets (Required for JWT & Encryption):**
Generate these with secure random values:
```bash
# JWT Authentication (use openssl rand -base64 32 for each)
JWT_SECRET=<generate-random-secret>
ENCRYPTION_KEY=<generate-random-secret>
PICOIN_ENCRYPTION_KEY=<generate-random-secret>

# Generate RSA key pair for JWT (optional, advanced):
# openssl genrsa -out private.pem 2048
# openssl rsa -in private.pem -pubout -out public.pem
JWT_PRIVATE_KEY=<paste-private-pem-contents-here>
JWT_PUBLIC_KEY=<paste-public-pem-contents-here>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

**Optional API Keys:**
```bash
SPORTS_API_KEY=<your-sports-api-key>
ODDS_API_KEY=<your-odds-api-key>
OPENAI_API_KEY=<your-openai-key>
CLAUDE_API_KEY=<your-claude-key>
ANALYTICS_API_KEY=<your-analytics-key>
```

For **magajico-ml-service**:
```bash
FRONTEND_URL=https://your-app.vercel.app
PYTHON_VERSION=3.11.13
MODEL_PATH=model_data.pkl
ENVIRONMENT=production
```

6. Click **Apply** and wait 5-10 minutes for builds
7. Note your backend URLs:
   - Backend API: `https://magajico-backend.onrender.com`
   - ML Service: `https://magajico-ml-service.onrender.com`

### ⚠️ Free Tier Notes
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Use [UptimeRobot](https://uptimerobot.com) to ping every 10 min to keep alive (optional)

---

## 🌐 Step 3: Deploy Frontend to Vercel (Zero Cost)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration from `vercel.json`

### Environment Variables to Set

In Vercel Project Settings → Environment Variables:

```bash
# Backend URL (from Render)
NEXT_PUBLIC_BACKEND_URL=https://magajico-backend.onrender.com

# MongoDB (same as backend)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportscentral

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<your-generated-secret>

# Optional: API Keys (only if using these features)
NEXT_PUBLIC_ODDS_API_KEY=<your-odds-api-key>
NEXT_PUBLIC_ANALYTICS_API_KEY=<your-analytics-api-key>
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-vapid-public-key>
```

5. Click **Deploy**
6. Your app will be live at `https://your-app.vercel.app`

---

## ✅ Step 4: Verify Deployment

### Test Backend
```bash
curl https://magajico-backend.onrender.com/health
```
Expected: `{"status":"ok"}`

### Test ML Service
```bash
curl https://magajico-ml-service.onrender.com/health
```
Expected: `{"status":"healthy","model_loaded":true}`

### Test Frontend
Visit `https://your-app.vercel.app` and verify the app loads correctly.

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

- **Push to `main` branch** → Auto-deploys to production
- **Push to other branches** → Creates preview deployments (Vercel only)

---

## 🔒 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Configure MongoDB IP whitelist (avoid `0.0.0.0/0` in production)
- [ ] Use environment variables for all secrets (never commit)
- [ ] Enable Vercel password protection during development (optional)

---

## 🐛 Common Issues

**Backend won't connect to MongoDB:**
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**Frontend can't reach backend:**
- Update `NEXT_PUBLIC_BACKEND_URL` in Vercel env vars
- Check backend URL is correct
- Verify backend service is running on Render

**Build fails on Vercel:**
- Ensure shared package builds first (already configured in `vercel.json`)
- Check build logs for specific errors

---

## 💰 Cost Breakdown

| Service | Platform | Tier | Monthly Cost |
|---------|----------|------|--------------|
| Frontend | Vercel | Free | **$0** |
| Backend API | Render | Free | **$0** |
| ML Service | Render | Free | **$0** |
| Database | MongoDB Atlas | M0 Free | **$0** |
| **TOTAL** | | | **$0/month** |

---

## 📚 Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 📞 Need Help?

Check the logs:
- **Render**: Dashboard → Service → Logs tab
- **Vercel**: Dashboard → Project → Deployments → View logs
- **MongoDB**: Atlas Dashboard → Database → Metrics

---

**That's it!** Your Sports Central app is now deployed at zero cost. 🎉
