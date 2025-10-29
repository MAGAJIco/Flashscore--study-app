
# Backend Modular Architecture

Clean, feature-based organization following domain-driven design principles.

## 📁 Module Structure

Each module follows this pattern:

```
modules/
├── [feature-name]/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Feature-specific middleware
│   ├── __tests__/       # Unit & integration tests
│   └── routes.ts        # Route registration
```

## 🎯 Active Modules

### Core Features
- **predictions/** - AI-powered match predictions & ML integration
- **matches/** - Live match tracking & real-time updates
- **news/** - Sports news articles & author management
- **social/** - Social feed, challenges, community features
- **rewards/** - Achievement system & gamification
- **kids/** - COPPA-compliant kids mode enforcement

### Core Services
- **core/** - Authentication, payments, foundation services

## 🔧 Route Registration

All modules register under `/api/[module-name]` prefix.

Example: `/api/predictions`, `/api/matches`, `/api/news`

## ✅ Best Practices

1. Each module is self-contained
2. Shared utilities in `/utils` or `/middleware`
3. Clear separation: routes → controllers → services
4. Database models in `/models` (shared)
5. Feature-specific middleware in module folders
