# Deployment Fixes for Render & Vercel

## 🔴 ROOT CAUSES

### **Backend (Render) Failures:**
1. ❌ TypeScript build errors (fastify.log.error syntax) - **FIXED**
2. ❌ Monorepo workspace dependencies not installed correctly
3. ❌ Build command doesn't handle shared packages
4. ❌ Missing root directory configuration

### **Frontend (Vercel) Failures:**
1. ❌ vercel.json buildCommand/installCommand are IGNORED by Vercel
2. ❌ Workspace packages (@magajico/shared) not resolved
3. ❌ Missing root directory setting
4. ❌ Build must run from monorepo root first

---

## ✅ PERMANENT SOLUTIONS

### **1. RENDER BACKEND FIX**

#### **Option A: Using render.yaml (Current)**

Update your `render.yaml` to:
```yaml
services:
  - type: web
    name: magajico-backend
    env: node
    region: oregon
    plan: free
    rootDir: apps/backend  # ← SET THIS
    buildCommand: cd ../.. && pnpm install && cd apps/backend && pnpm build
    startCommand: pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: PORT
        value: 10000
```

**Key Changes:**
- Added `rootDir: apps/backend` so Render knows the service location
- Build installs from root (`cd ../..`) to resolve workspace dependencies
- Then builds from backend directory

#### **Option B: Using Render Dashboard (RECOMMENDED)**

**Better approach - configure via Render UI:**
1. Go to your service → Settings
2. **Root Directory:** `apps/backend`
3. **Build Command:** `cd ../.. && pnpm install && cd apps/backend && pnpm build`
4. **Start Command:** `pnpm start`
5. **Build Filters:**
   - Include: `apps/backend/**` and `packages/shared/**`
   - This prevents rebuilds when frontend changes

---

### **2. VERCEL FRONTEND FIX**

#### **CRITICAL: vercel.json settings are IGNORED**
Vercel ignores buildCommand/installCommand in vercel.json for monorepos.
You MUST configure via Vercel Dashboard.

#### **Steps to Fix:**

1. **Delete or Update vercel.json:**
```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "apps/frontend/src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

2. **Configure via Vercel Dashboard:**
   - Go to Project Settings → General
   - **Root Directory:** `apps/frontend`
   - **Framework Preset:** Next.js
   - **Build Command:** Leave EMPTY (auto-detected)
   - **Install Command:** `cd ../.. && pnpm install`
   - **Output Directory:** Leave EMPTY (auto-detected as `.next`)

3. **Update next.config.js to handle workspace packages:**
```javascript
// apps/frontend/next.config.js
const nextConfig = {
  transpilePackages: ['@magajico/shared'], // ← Add this
  experimental: {
    externalDir: true, // Allow imports from outside app dir
  },
  // ... rest of your config
};

module.exports = nextConfig;
```

---

### **3. SHARED PACKAGES FIX**

Ensure `packages/shared/package.json` has proper build setup:

```json
{
  "name": "@magajico/shared",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/libs/types/index.ts",
    "./utils": "./src/libs/utils/index.ts",
    "./models": "./src/libs/models/index.ts"
  },
  "scripts": {
    "build": "tsc" // If you need to compile
  }
}
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Every Deploy:

**Backend (Render):**
- [ ] TypeScript compiles locally: `cd apps/backend && pnpm build`
- [ ] No errors in build output
- [ ] Environment variables set in Render dashboard
- [ ] Root directory configured correctly

**Frontend (Vercel):**
- [ ] Root directory set to `apps/frontend`
- [ ] Install command uses monorepo root: `cd ../.. && pnpm install`
- [ ] Workspace packages listed in `transpilePackages`
- [ ] Build works locally: `cd apps/frontend && pnpm build`

---

## 🔧 TROUBLESHOOTING

### If Backend Still Fails:
1. Check Render logs for specific error
2. Verify pnpm version matches local (add to package.json)
3. Try Docker deployment (see advanced section)

### If Frontend Still Fails:
1. Clear Vercel cache (redeploy with "Clear Cache and Deploy")
2. Verify case-sensitive file imports (Vercel uses Linux)
3. Check all runtime deps are in `dependencies`, not `devDependencies`
4. Test with: `vercel build` locally

---

## 📊 WHAT I'VE ALREADY FIXED

✅ **Backend Build Errors:**
- Fixed fastify.log.error() syntax in newsAuthors.ts
- Changed from `.error('message:', error)` → `.error(error, 'message')`
- Backend now compiles successfully

✅ **Dependencies:**
- Installed all pnpm packages
- Installed Python ML API dependencies
- All workflows running locally

---

## 🎯 NEXT STEPS

1. **Update render.yaml** with the corrected configuration above
2. **Configure Vercel via Dashboard** (don't rely on vercel.json)
3. **Test deployment** and check logs
4. **Set environment variables** in both platforms
5. **Monitor first deployment** for any remaining issues

The core issue was that both platforms need special monorepo handling, and your current configs didn't account for workspace dependencies. With these fixes, deployments should succeed consistently.
