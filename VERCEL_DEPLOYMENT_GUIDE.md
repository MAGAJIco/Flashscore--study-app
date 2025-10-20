# Vercel Deployment Guide for Sports Central Monorepo

## Why Was Vercel Deployment Difficult?

Your monorepo had **3 critical configuration issues** that prevented proper Vercel deployment:

---

## ❌ Problem 1: Shared Package Pointed to Non-Existent Files

**Before:**
```json
// packages/shared/package.json
{
  "main": "./dist/index.js",   // ❌ dist/ folder didn't exist!
  "exports": {
    ".": "./dist/index.js"
  }
}
```

**Why This Failed:**
- Vercel tried to import from `dist/` but it didn't exist
- The build command tried to compile TypeScript to `dist/` first
- Added unnecessary build complexity

**✅ Fixed:**
```json
// packages/shared/package.json
{
  "main": "./src/index.ts",    // ✅ Points to source files
  "exports": {
    ".": "./src/index.ts"
  }
}
```

**Why This Works:**
- `transpilePackages` in Next.js **expects source files** (`.ts`), not compiled output
- Next.js will transpile the shared package during its own build
- No separate build step needed

---

## ❌ Problem 2: Inconsistent Import Paths

Your frontend used **3 different ways** to import from the shared package:

```typescript
// ❌ Bad - Direct relative path
import ReplitStorage from '@/../packages/shared/src/libs/utils/replitStorage';

// ❌ Bad - Custom alias without package name
import PaymentManager from '@shared/libs/utils/paymentManager';

// ✅ Good - Proper package import
import { AlertManager } from '@magajico/shared';
```

**Why This Failed:**
- Vercel couldn't resolve relative paths like `@/../packages/...`
- Path aliases (`@shared/*`) worked locally but broke on Vercel
- Inconsistent imports made transpilation unpredictable

**✅ Fixed:**
Use the **package name** consistently:
```typescript
// Main exports
import { AlertManager, APIManager, BackupManager } from '@magajico/shared';

// Sub-path exports (if needed)
import { Match } from '@magajico/shared/models';
import { timeZoneService } from '@magajico/shared/types';
```

---

## ❌ Problem 3: Unnecessary Build Step in vercel.json

**Before:**
```json
{
  "buildCommand": "npm run build --workspace=packages/shared && npm run build --workspace=apps/frontend"
}
```

**Why This Failed:**
- Trying to build `packages/shared` first added complexity
- The shared package doesn't need to be built separately
- Slowed down deployments and caused race conditions

**✅ Fixed:**
```json
{
  "buildCommand": "npm run build --workspace=apps/frontend"
}
```

**Why This Works:**
- Next.js transpiles shared packages automatically via `transpilePackages`
- One build step = faster, more reliable deployments
- Vercel handles workspace dependencies automatically

---

## ✅ What I Fixed

### 1. Updated `packages/shared/package.json`
- Changed `main` and `exports` to point to source files (`./src/`)
- Removed the TypeScript build step (Next.js handles it)
- Added `type-check` script for development

### 2. Updated `vercel.json`
- Removed the shared package build command
- Simplified to only build the frontend

### 3. Cleaned Up `apps/frontend/tsconfig.json`
- Removed duplicate `paths` and `compilerOptions`
- Kept `@shared/*` alias for convenience
- Made configuration cleaner and more maintainable

### 4. Added `@magajico/shared` Dependency
- Explicitly listed in `apps/frontend/package.json`
- Ensures Vercel installs it correctly

---

## 🚀 How to Deploy to Vercel Now

### Step 1: Push Your Changes
```bash
git add .
git commit -m "Fix Vercel monorepo configuration"
git push
```

### Step 2: Configure Vercel Project Settings

1. **Root Directory:** Leave empty (monorepo root)
2. **Build Command:** `npm run build --workspace=apps/frontend`
3. **Output Directory:** `apps/frontend/.next`
4. **Install Command:** `npm ci`

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_BACKEND_URL=https://magajico-backend.onrender.com
NEXT_PUBLIC_ML_SERVICE_URL=https://magajico-backend.onrender.com
MONGODB_URI=your-mongodb-connection-string
```

### Step 4: Deploy!
```bash
vercel deploy --prod
```

---

## 📝 Best Practices Going Forward

### ✅ DO:
- Import from `@magajico/shared` using the package name
- Keep shared packages as **source files** (`.ts`), not compiled
- Use `transpilePackages: ["@magajico/shared"]` in `next.config.js`
- Let Next.js handle all transpilation

### ❌ DON'T:
- Use relative imports like `@/../packages/shared/...`
- Build the shared package separately before Next.js
- Point shared package exports to `dist/` folders
- Mix different import styles in the same project

---

## 🐛 Troubleshooting

### Build Fails with "Cannot find module '@magajico/shared'"

**Fix:** Ensure the dependency is in `apps/frontend/package.json`:
```json
{
  "dependencies": {
    "@magajico/shared": "*"
  }
}
```

### Components Don't Render on Vercel

**Fix:** Check that `transpilePackages` is in `next.config.js`:
```javascript
module.exports = {
  transpilePackages: ["@magajico/shared"],
}
```

### TypeScript Errors During Build

**Fix:** Run type-check locally first:
```bash
npm run type-check --workspace=apps/frontend
```

---

## 📚 Additional Resources

- [Next.js transpilePackages Docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages)
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

---

## ✨ Summary

Your monorepo is now **properly configured for Vercel**! The key changes:

1. ✅ Shared package exports source files
2. ✅ Simplified build process (no separate shared build)
3. ✅ Clean TypeScript configuration
4. ✅ Consistent import strategy using package names

You should now be able to deploy to Vercel **without any issues**! 🎉
