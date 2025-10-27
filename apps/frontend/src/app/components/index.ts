// Core Layout Components
export { Header } from './Header';
export { SidebarNav } from './SidebarNav';
export { MainLayoutWrapper } from './MainLayoutWrapper';
export { BottomNavigation } from './BottomNavigation';
export { AppWrapper } from './AppWrapper';
export { MobileOptimizationWrapper } from './MobileOptimizationWrapper';

// Error Handling & Loading
export { GlobalErrorHandler } from './GlobalErrorHandler';
export { EnhancedErrorBoundary } from './EnhancedErrorBoundary';
export { LoadingSpinner } from './LoadingSpinner';
export { LoadingSkeleton } from './LoadingSkeleton';
export { HydrationSafeWrapper } from './HydrationSafeWrapper';

// Feature Components - Predictions
// export { PredictionCard } from './PredictionCard'; // REMOVED: Component doesn't exist
export { MLPredictionInterface } from './MLPredictionInterface';
export { MLModelDashboard } from './MLModelDashboard';
export { ConfidenceSlider } from './ConfidenceSlider';

// Feature Components - Live Tracking
export { LiveMatchTracker } from './LiveMatchTracker';
export { LiveScoreCard } from './LiveScoreCard';
export { EnhancedLiveTracker } from './EnhancedLiveTracker';

// Feature Components - News
export { LatestNews } from './LatestNews';
export { AuthorCard } from './AuthorCard';
export { AuthorNewsDisplay } from './AuthorNewsDisplay';

// Feature Components - Social
// export { SocialFeed } from './SocialFeed'; // REMOVED: Component doesn't exist
export { ChallengeSystem } from './ChallengeSystem';
export { Forum } from './Forum';
// export { Leaderboard } from './Leaderboard'; // REMOVED: Component doesn't exist

// Feature Components - Rewards
export { AchievementSystem } from './AchievementSystem';
// export { RewardsDashboard } from './RewardsDashboard'; // REMOVED: Component doesn't exist
// export { ProgressTracker } from './ProgressTracker'; // REMOVED: Component doesn't exist

// Kids Mode
export { KidsModeDashboard } from './KidsModeDashboard';
export { AgeRestrictionGuard } from './AgeRestrictionGuard';

// Analytics & Monitoring
export { AdvancedAnalytics } from './AdvancedAnalytics';
export { BackendHealthMonitor } from './BackendHealthMonitor';
// export { PerformanceMonitor } from './PerformanceMonitor'; // REMOVED: Component doesn't exist

// UI Components
export { LanguageSwitcher } from './LanguageSwitcher';
export { ThemeToggle } from './ThemeToggle';
// export { SearchBar } from './SearchBar'; // REMOVED: Component doesn't exist
// export { NotificationCenter } from './NotificationCenter'; // REMOVED: Component doesn't exist

// Platform Features
export { MobileInstallPrompter } from './MobileInstallPrompter';
// export { PWAInstaller } from './PWAInstaller'; // REMOVED: Component doesn't exist
export { OfflineIndicator } from './OfflineIndicator';

// Documentation
export * from './docs';
