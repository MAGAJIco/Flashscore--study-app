# Deployment Guide

This guide explains how to deploy the MagajiCo application with the backend on Render and frontend on Vercel.

## Prerequisites

- MongoDB Atlas account (free tier works)
- Render account (for backend)
- Vercel account (for frontend)
- pnpm installed locally (for testing)

## Backend Deployment (Render)

### 1. Prepare MongoDB

1. Create a MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IPs (0.0.0.0/0) for Render access
4. Copy your connection string

### 2. Deploy to Render

1. Push your code to GitHub/GitLab
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your repository
4. Render will automatically detect the `render.yaml` configuration
5. Set the following environment variables in Render Dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (use a password generator)
   - `ENCRYPTION_KEY`: A 32-character random string
   - `FRONTEND_URL`: Your Vercel frontend URL (add after deploying frontend)
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., `https://your-app.vercel.app,https://www.your-domain.com`)

### 3. Note Your Backend URL

After deployment, note your Render backend URL (e.g., `https://magajico-backend.onrender.com`)

## Frontend Deployment (Vercel)

### 1. Update Configuration

Update `apps/frontend/vercel.json`:
- Replace the destination URL in rewrites with your actual Render backend URL

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure the following:
   - **Root Directory**: Leave as root (monorepo detected)
   - **Framework**: Next.js
   - **Build Command**: `pnpm install && cd apps/frontend && pnpm build`
   - **Output Directory**: `apps/frontend/.next`
   - **Install Command**: `pnpm install`

### 3. Set Environment Variables in Vercel

Add these environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL
- `NEXTAUTH_URL`: Your Vercel app URL
- `NEXTAUTH_SECRET`: A secure random string
- `MONGODB_URI`: Your MongoDB Atlas connection string (same as backend)

### 4. Update Backend CORS

After getting your Vercel URL, go back to Render and update these environment variables:
- `FRONTEND_URL`: Set to your Vercel app URL (e.g., `https://your-app.vercel.app`)
- `ALLOWED_ORIGINS`: Add your Vercel URL and any custom domains (comma-separated)

Example:
```
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com
```

**Important**: URLs are automatically normalized (trailing slashes removed), but ensure:
- Use full URLs with protocol (https://)
- No trailing slashes (automatic normalization handles this)
- Separate multiple origins with commas
- No spaces except after commas

Then restart your Render service for the changes to take effect.

## Verification

1. Visit your Vercel frontend URL
2. Check that the app loads correctly
3. Verify API calls are working (check Network tab in browser DevTools)
4. Test authentication flows if applicable

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set

### Frontend Issues
- Check Vercel deployment logs
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check browser console for CORS errors
- Ensure API rewrites are configured correctly

### CORS Errors
- Make sure backend `ALLOWED_ORIGINS` includes your Vercel URL
- Verify the backend is listening on `0.0.0.0` in production

## Free Tier Limitations

### Render Free Tier
- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for one service)

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless function execution limits apply

## Production Considerations

For production use, consider:
1. Upgrading to paid tiers for better performance
2. Setting up monitoring (e.g., Sentry, LogRocket)
3. Implementing proper error tracking
4. Adding rate limiting
5. Setting up CI/CD pipelines
6. Using environment-specific configurations
