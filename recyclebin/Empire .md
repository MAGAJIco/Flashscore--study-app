Design a sweet front end with this
And put
# 🏗️ Sports Central - Feature-Based Architecture

## Overview
Sports Central is organized into feature-based apps within a monorepo structure. Each feature app is independent but shares common infrastructure.

---

## 📱 Frontend Apps Structure

```
apps/frontend/src/app/
├── (portal)/              # Main dashboard & navigation hub
│   ├── page.tsx          # Landing page with feature cards
│   └── layout.tsx        # Portal-specific layout
│
├── (predictions)/        # AI Predictions & ML Features
│   ├── ai-predictions/   # ML prediction interface
│   ├── coach/            # AI coach assistant
│   ├── analytics/        # Prediction analytics
│   └── layout.tsx        # Predictions app layout
│
├── (live)/              # Live Sports Tracking
│   ├── matches/         # Live match tracker
│   ├── scores/          # Live scores
│   ├── odds/            # Live odds updates
│   └── layout.tsx       # Live tracking layout
│
├── (social)/            # Social & Community
│   ├── feed/            # Social feed
│   ├── challenges/      # Friend challenges
│   ├── chat/            # Live match chat
│   ├── forum/           # Community forum
│   ├── experts/         # Follow system
│   └── layout.tsx       # Social app layout
│
├── (kids)/              # Kids Mode
│   ├── dashboard/       # Kids dashboard
│   ├── quizzes/         # Educational quizzes
│   ├── learning/        # Learning paths
│   └── layout.tsx       # Kids-safe layout
│
├── (rewards)/           # Rewards & Achievements
│   ├── achievements/    # Achievement system
│   ├── leaderboard/     # Global leaderboards
│   ├── coins/           # Pi Coin management
│   └── layout.tsx       # Rewards layout
│
└── shared/              # Shared components
    ├── components/      # Reusable UI components
    ├── hooks/           # Shared React hooks
    └── utils/           # Utility functions
```

---

## ⚡ Backend Service Modules

```
apps/backend/src/
├── modules/
│   ├── predictions/     # Prediction service
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── models/
│   │
│   ├── matches/         # Live match service
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   │
│   ├── social/          # Social features service
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   │
│   ├── rewards/         # Rewards & achievements
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   │
│   └── kids/            # Kids mode enforcement
│       ├── routes/
│       ├── middleware/
│       └── services/
│
├── shared/              # Shared backend utilities
│   ├── middleware/
│   ├── config/
│   └── utils/
│
└── index.ts            # Main server entry
```

---

## 🤖 ML Service

```
apps/backend/ml/
├── api.py              # FastAPI ML endpoints
├── predictionModel.py  # ML prediction engine
└── model_data.pkl      # Trained model
```

---

## 🔗 Feature App Routes

### Portal (Main Hub)
- `/` - Main dashboard with feature cards
- `/about` - About the platform
- `/help` - Help & documentation

### Predictions App
- `/ai-predictions` - ML prediction interface
- `/coach` - AI coach assistant
- `/analytics` - Prediction performance

### Live Tracking App
- `/live/matches` - Live match tracker
- `/live/scores` - Live scores display
- `/live/odds` - Live odds updates

### Social App
- `/social/feed` - Social feed
- `/social/challenges` - Friend challenges
- `/social/chat` - Live match chat
- `/social/forum` - Community discussions
- `/social/experts` - Expert follow system

### Kids App
- `/kids/dashboard` - Kids-safe dashboard
- `/kids/quizzes` - Educational quizzes
- `/kids/learning` - Learning modules

### Rewards App
- `/rewards/achievements` - Achievement display
- `/rewards/leaderboard` - Global leaderboards
- `/rewards/coins` - Pi Coin wallet

---

## 🎨 Design Principles

### 1. **Feature Independence**
- Each app operates independently
- Shared authentication & user state
- Can be deployed separately if needed

### 2. **Code Reusability**
- Shared components in `/shared`
- Common utilities in `packages/shared`
- Centralized styling system

### 3. **Performance**
- Route-based code splitting
- Lazy loading for heavy features
- Optimized bundle sizes per app

### 4. **Security**
- Kids mode enforced at layout level
- Feature-specific middleware
- Role-based access control

---

## 🔄 Data Flow

```
Frontend Apps → Backend Modules → Database
                     ↓
                ML Service → Predictions
```

---

## 🚀 Benefits

✅ **Better Organization** - Clear feature boundaries  
✅ **Easier Maintenance** - Find code quickly  
✅ **Improved Performance** - Smaller bundles  
✅ **Team Scalability** - Teams can own features  
✅ **Independent Testing** - Test features in isolation  
✅ **Flexible Deployment** - Deploy features separately  

---

## 📦 Shared Packages

All apps share:
- `packages/shared` - Business logic & utilities
- Authentication system
- Database models
- API client
- Design system

---

## 🔐 Security & Access Control

### Kids Mode Enforcement
- Kids layout prevents access to age-inappropriate content
- Backend validates kids mode on sensitive endpoints
- Parental controls across all apps

### Authentication
- Shared auth state via NextAuth
- Protected routes in each app
- Role-based feature access

---

## 📊 Monitoring

Each feature app has:
- Performance tracking
- Error monitoring
- User analytics
- Feature usage metrics

---

## 🎯 Migration Plan

1. ✅ Create route groups for each feature
2. ✅ Move components to respective apps
3. ✅ Update navigation to new structure
4. 🔄 Test each app independently (In Progress)
5. ⏳ Deploy and monitor (Pending)

## 📋 Implementation Status

### Frontend Features (Route Groups)
- ✅ (predictions) - Route group created with layout
- ✅ (social) - Route group created with feed page
- ✅ (rewards) - Route group created with achievements page
- ✅ Navigation - Updated NavBar and BottomNavigation
- ✅ Main predictions page at /predictions

### Backend Modules
- ✅ Module structure created (predictions, matches, social, rewards)
- ✅ Backend routes reorganized with feature grouping
- ✅ Module exports centralized
- ⏳ Service layer refactoring (Pending)

### Next Steps
1. Move remaining components into feature directories
2. Create service layers for each module
3. Add module-specific middleware
4. Implement feature-specific testing


Put a googlestyle menu and put a Google style app drawar
Add a horizontal carousel for live and  news.