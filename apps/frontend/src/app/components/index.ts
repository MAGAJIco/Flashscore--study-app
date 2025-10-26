// Error Monitoring & Boundaries
export { ErrorMonitor } from './ErrorMonitor';
export { ProductionErrorBoundary as ErrorBoundary } from './ErrorBoundary/ErrorBoundaryWithPerformance';
export { BackendHealthMonitor } from './BackendHealthMonitor';
export { BackendStatusIndicator } from './BackendStatusIndicator';
export { EnhancedErrorBoundary } from './EnhancedErrorBoundary';
export { GlobalErrorHandler } from './GlobalErrorHandler';

// Core Layout Components
export { AppWrapper } from './AppWrapper';
export { DIYF } from './diyf';
export { MobileLayout } from './MobileLayout';
export { MobileOptimizationWrapper } from './MobileOptimizationWrapper';
export { HydrationSafeWrapper } from './HydrationSafeWrapper';

// Navigation
export { BottomNavigation } from './BottomNavigation';
export { NavBar } from './NavBar';
export { Header } from './Header';
export { AppDrawer } from './AppDrawer';

// Loading States
export { LoadingSkeleton } from './LoadingSkeleton';
export { LoadingSpinner } from './LoadingSpinner';
export { SmartLoadingState } from './SmartLoadingState';

// Performance Monitoring
export { AmazonStylePerformanceMonitor } from './AmazonStylePerformanceMonitor';

// Live Features
export { LiveMatchTracker } from './LiveMatchTracker';
export { LiveOddsUpdater } from './LiveOddsUpdater';
export { EnhancedLiveTracker } from './EnhancedLiveTracker';

// Prediction Features
export { MLPredictionInterface } from './MLPredictionInterface';
export { PredictionInterface } from './PredictionInterface';
export { ConfidenceSlider } from './ConfidenceSlider';
export { PredictionHub } from './PredictionHub';
export { PredictionPreview } from './PredictionPreview';
export { ConfidenceCalibration } from './ConfidenceCalibration';

// Portal & Dashboard
export { PortalDashboard } from './PortalDashboard';
export { PortalWidgetSystem } from './PortalWidgetSystem';
export { PortalCommandCenter } from './PortalCommandCenter';
export { UnifiedSportsHub } from './UnifiedSportsHub';

// News & Social
export { SmartNewsFeed } from './SmartNewsFeed';
export { ConnectedNewsFeed } from './ConnectedNewsFeed';
export { FeatureShowcase } from './FeatureShowcase';
// export { FeatureHub } from './FeatureHub'; // TODO: Restore with proper shared utils integration for production

// User Interaction
export { PullToRefreshWrapper } from './PullToRefreshWrapper';
export { EnhancedMicroInteractions } from './EnhancedMicroInteractions';
export { HapticManager, haptic, useHapticFeedback } from './HapticFeedback';

// PWA
export { InstallPrompt } from './InstallPrompt';
export { PWAServiceWorker } from './PWAServiceWorker';

// Additional Components
export { AuthorCard } from './AuthorCard';
export { AuthorNewsDisplay } from './AuthorNewsDisplay';
export { AuthorsLeaderboard } from './AuthorsLeaderboard';
export { AuthorsSidebar } from './AuthorsSidebar';
export { Breadcrumbs } from './Breadcrumbs';
export { DateSelector } from './DateSelector';
export { LatestNews } from './LatestNews';
export { LiveScoreCard } from './LiveScoreCard';
export { LoginModal } from './LoginModal';
export { ThemeToggle } from './ThemeToggle';
export { Welcome } from './Welcome';
export { LanguageSwitcher } from './LanguageSwitcher';

// Alerts & Notifications
export { FloatingAlert, triggerFloatingAlert } from './FloatingAlert';

// Payment & Security
export { SecurePaymentHandler } from './SecurePaymentHandler';

// Platform Features
export { PlatformShowcase } from './PlatformShowcase';

// iOS Components
export { IOSInterface } from './iOSInterface';
export { IOSStyleFeatures } from './IOSStyleFeatures';

// Achievements
export { AchievementSystem } from './AchievementSystem';

// Type exports
export type { Achievement } from './AchievementCelebration';

// Export all components from this barrel file
export { default as App } from './App';

// Missing exports that are causing errors
export { default as ComprehensiveSportsHub } from './ComprehensiveSportsHub';
export { default as PortalWidgetSystem } from './PortalWidgetSystem';
export { default as PortalCommandCenter } from './PortalCommandCenter';
export { default as FloatingAlert } from './FloatingAlert';
export { default as AmazonStylePerformanceMonitor } from './AmazonStylePerformanceMonitor';