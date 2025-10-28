
# MagajiCo Architecture Documentation

## 🏗️ System Overview

Clean, modular monorepo architecture with feature-based organization.

```
magajico-monorepo/
├── apps/
│   ├── backend/          # Fastify API (Port 3001)
│   └── frontend/         # Next.js 14 (Port 5000)
└── packages/
    └── shared/           # Shared types & utilities
```

## 📡 Backend Architecture (Clean Module-Based)

### Structure
```
apps/backend/src/
├── modules/              # Feature modules (domain-driven)
│   ├── predictions/      # AI predictions & ML
│   ├── matches/          # Live match tracking
│   ├── news/            # News & authors
│   ├── social/          # Social features
│   ├── rewards/         # Gamification
│   ├── kids/            # Kids mode
│   └── core/            # Auth, payments, foundation
├── models/              # MongoDB schemas (shared)
├── middleware/          # Global middleware
├── config/              # Configuration
└── utils/               # Shared utilities
```

### API Routes
All routes under `/api` prefix:

- `/api/predictions` - Prediction services
- `/api/matches` - Live match data
- `/api/news` - News articles
- `/api/news/authors` - News authors
- `/api/social` - Social features
- `/api/rewards` - Achievements
- `/api/kids` - Kids mode
- `/api/auth` - Authentication
- `/api/payments` - Payment processing
- `/api/stripe` - Stripe integration

### Module Pattern
```typescript
modules/[feature]/
├── controllers/    # Request handlers
├── services/       # Business logic
├── middleware/     # Feature middleware
├── __tests__/      # Tests
└── routes.ts       # Route registration
```

## 🎨 Frontend Architecture (Feature-Based Routes)

### Structure
```
apps/frontend/src/app/[locale]/
├── empire/          # Empire Central (main dashboard & command center)
├── (predictions)/   # AI predictions
├── (live)/         # Live tracking
├── (social)/       # Social hub
├── (rewards)/      # Achievements
├── (docs)/         # Documentation
└── components/     # Shared components (45 active)
```

### Empire Central
Empire is the unified command center that replaced the legacy Portal:
- **Foundation System**: Build your empire through progressive stages
- **Leaderboard**: Global rankings and competition
- **Achievements**: Track progress and unlock rewards
- **Power System**: Gamified progression mechanics

### Component Organization
- **Core**: Layout, navigation, error handling
- **Features**: Empire, predictions, live, news, social, rewards
- **Platform**: PWA, analytics, monitoring
- **Docs**: Interactive documentation components

## 🔄 Data Flow

1. **Frontend** → API routes → Backend modules
2. **Backend** → Services → Controllers → Routes
3. **Shared** → Types & utilities used by both

## 🚀 Deployment

- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Render (Fastify + ML Service)
- **Database**: MongoDB Atlas (Free tier)

## ✅ Clean Architecture Benefits

1. **Modular**: Each feature is self-contained
2. **Scalable**: Easy to add new features
3. **Testable**: Clear boundaries for testing
4. **Maintainable**: Code is organized by domain
5. **No Legacy**: All deprecated routes/components removed
6. **Unified**: Empire Central provides cohesive user experience
