
import { describe, it, expect } from 'vitest';

describe('Barrel Exports', () => {
  it('should export all components from @components', async () => {
    const components = await import('@components');
    
    // Core Components
    expect(components.App).toBeDefined();
    expect(components.AppWrapper).toBeDefined();
    
    // Navigation
    expect(components.BottomNavigation).toBeDefined();
    expect(components.Header).toBeDefined();
    
    // Features
    expect(components.LiveMatchTracker).toBeDefined();
    expect(components.LiveOddsUpdater).toBeDefined();
    expect(components.ConfidenceSlider).toBeDefined();
    expect(components.PullToRefreshWrapper).toBeDefined();
    expect(components.EnhancedMicroInteractions).toBeDefined();
    expect(components.HapticFeedback).toBeDefined();
    
    // PWA
    expect(components.InstallPrompt).toBeDefined();
    
    // Loading States
    expect(components.SmartLoadingState).toBeDefined();
    expect(components.LoadingSkeleton).toBeDefined();
    
    // Error Handling
    expect(components.ErrorMonitor).toBeDefined();
    expect(components.BackendHealthMonitor).toBeDefined();
  });

  it('should export all hooks from @hooks', async () => {
    const hooks = await import('@hooks');
    
    expect(hooks.useAuth).toBeDefined();
    expect(hooks.useBackendHealth).toBeDefined();
    expect(hooks.useGestureControls).toBeDefined();
    expect(hooks.useSwipeableItem).toBeDefined();
    expect(hooks.useKidsMode).toBeDefined();
    expect(hooks.useTheme).toBeDefined();
  });

  it('should export services from @services', async () => {
    const services = await import('@services');
    
    expect(services.newsAuthorService).toBeDefined();
    expect(services.newsService).toBeDefined();
    expect(services.searchService).toBeDefined();
  });
});
