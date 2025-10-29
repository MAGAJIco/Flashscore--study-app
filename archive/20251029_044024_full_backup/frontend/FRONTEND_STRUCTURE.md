
# Frontend Structure Analysis

## `/src/lib` Directory

### Core Libraries

#### **API Layer** (`/lib/api/`)
- `client.ts` - API client for backend communication
- `foundation.ts` - Foundation/Empire API integration

#### **Constants** (`/lib/constant/`)
- `apps.ts` - App definitions and configurations
- `features.ts` - Feature flags and settings
- `mockData.ts` - Mock data for development/testing

#### **Internationalization** (`/lib/i18n/`)
- `locale-manager.ts` - Locale detection and management

#### **Navigation** (`/lib/navigation/`)
- `index.ts` - Navigation exports
- `navigation-items.ts` - Menu and navigation structure
- `navigation-provider.tsx` - Navigation context provider
- `use-navigation.ts` - Navigation hook

#### **Platform Components** (`/lib/platform/`)
- **Carousel**: `HorizontalCarousel.tsx` - Reusable carousel component
- **Navigation**: Platform-specific navigation utilities
- **UI**: Shared UI components and utilities

#### **Types** (`/lib/types/`)
- `browser.d.ts` - Browser-specific type definitions
- `index.ts` - Shared type exports

#### **Utilities**
- `api-client.ts` - HTTP client wrapper
- `cache.ts` - Caching utilities
- `circuit-breaker.ts` - Circuit breaker pattern implementation
- `distributed-tracing.ts` - Distributed tracing utilities
- `error-boundary.tsx` - Error boundary component
- `error-budget.ts` - Error budget tracking
- `gesture-recognition.ts` - Touch/gesture handling
- `lazy-loader.ts` - Component lazy loading
- `load-balancer.ts` - Load balancing utilities
- `mobile-detection.ts` - Mobile device detection
- `performance.ts` - Performance monitoring
- `prediction-cache.ts` - Prediction-specific caching
- `retry.ts` - Retry logic
- `service-mesh.ts` - Service mesh utilities

---

## `/src/app/components` Directory (45+ Active Components)

### **Layout Components**
- `AppDrawer.tsx` - Application drawer/sidebar
- `GoogleStyleNav.tsx` - Google-style navigation
- `BottomNavigation.tsx` - Mobile bottom navigation
- `Header.tsx` - Page header
- `Breadcrumbs.tsx` - Breadcrumb navigation
- `ManagementSidebar.tsx` - Admin sidebar

### **Card Components**
- `LiveScoreCard.tsx` - Live match score display
- `AuthorCard.tsx` - Author profile card
- Various feature-specific cards

### **Feature Components**

#### **AI/ML**
- `AICoachAssistant.tsx` - AI coaching features
- `MLModelDashboard.tsx` - ML model monitoring
- `MLPredictionInterface.tsx` - Prediction UI

#### **Predictions**
- `CollaborativePrediction.tsx` - Group predictions
- `ConfidenceSlider.tsx` - Confidence level selector
- `MicroPredictions.tsx` - Quick predictions
- `LiveMatchProbabilityTracker.tsx` - Live probability updates

#### **Social Features**
- `ChallengeFriends.tsx` - Friend challenges
- `ChallengeSystem.tsx` - Challenge management
- `Forum.tsx` - Community forum
- `LiveMatchChat.tsx` - Live chat
- `SocialShare.tsx` - Social sharing

#### **Content**
- `LatestNews.tsx` - News feed
- `ConnectedNewsFeed.tsx` - Real-time news
- `AuthorNewsDisplay.tsx` - Author-specific news
- `AuthorsLeaderboard.tsx` - Author rankings

#### **Kids Mode**
- `KidsModeDashboard.tsx` - Kids-safe dashboard
- `AgeRestrictionGuard.tsx` - Age verification
- `LanguageLearningMode.tsx` - Educational features

#### **Gamification**
- `AchievementSystem.tsx` - Achievement tracking
- `AchievementCelebration.tsx` - Achievement animations
- `EchoSystem.tsx` - Echo/feedback system
- `RewardSystem.tsx` - Reward distribution

#### **Platform Features**
- `InstallPrompt.tsx` - PWA install prompt
- `MobileInstallPrompter.tsx` - Mobile-specific install
- `OfflineIndicator.tsx` - Offline status
- `ThemeSelector.tsx` - Theme switching

#### **Monitoring & Performance**
- `BackendHealthMonitor.tsx` - Backend status
- `PerformanceMonitor.tsx` - Performance tracking
- `HydrationMonitor.tsx` - Hydration debugging
- `AutoDiagnostics.tsx` - Auto diagnostics

#### **Utilities**
- `LoadingSpinner.tsx` - Loading states
- `LoadingSkeleton.tsx` - Skeleton screens
- `ErrorBoundary.tsx` - Error handling
- `FloatingAlert.tsx` - Alert notifications
- `HapticFeedback.tsx` - Haptic responses

### **Empire/Command Center**
- `MagajiCoCommandCenter.tsx` - Main command interface
- `MagajiCoUnifiedDashboard.tsx` - Unified dashboard
- `MagajiCoAppLauncher.tsx` - App launcher
- `MagajiCoManager.tsx` - Empire management

### **Interactive Components**
- `InteractiveDocsComponent.tsx` - Interactive documentation
- `InteractiveTools.tsx` - Interactive utilities
- `HorizontalCarousel.tsx` - Horizontal scrolling carousel

---

## Component Organization Patterns

### **By Feature**
Components are organized by their primary feature area:
- Predictions
- Social
- Rewards
- Kids Mode
- News/Content
- Empire/Management

### **By Type**
- **Layout**: Navigation, headers, drawers
- **Cards**: Display components for specific data types
- **Forms**: Input and interaction components
- **Monitoring**: Health checks and diagnostics
- **Platform**: PWA, mobile-specific features

### **Shared vs Feature-Specific**
- **Shared** (`/components`): Used across multiple features
- **Feature-specific** (`/[locale]/(feature)/components`): Isolated to one feature

---

## Key Architectural Decisions

1. **Modular Design**: Each component is self-contained with minimal dependencies
2. **Performance First**: Lazy loading, code splitting, and optimization built-in
3. **Mobile-First**: Touch gestures, responsive design, PWA support
4. **Internationalization**: Multi-language support throughout
5. **Accessibility**: WCAG compliance, keyboard navigation, screen reader support
6. **Real-time**: WebSocket support for live updates
7. **Offline Support**: Service workers, caching strategies
8. **Type Safety**: Full TypeScript coverage

---

## Integration Points

### **Backend APIs**
- Predictions API
- Matches API
- News API
- ML Service API
- Social API
- Rewards API

### **External Services**
- Stripe (payments)
- MongoDB (database)
- FastAPI ML Service
- Analytics platforms

### **State Management**
- React Context for global state
- Local Storage for persistence
- API client for server state
- Cache layers for performance

---

**Last Updated**: January 2025
