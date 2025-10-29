
// Re-export shared types for convenient frontend imports
export type {
  Match,
  LiveMatch,
  Team,
  MatchEvent,
  User,
  UserPreferences,
  ICoppaConsent,
  NewsArticle,
  NewsAuthor,
  Prediction,
  MLPrediction,
  PredictionFactor,
  APIResponse,
  HealthCheckResponse
} from '@magajico/shared';

// Frontend-specific types
export interface AppRoute {
  name: string;
  path: string;
  icon?: string;
  description?: string;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'auto';
}
