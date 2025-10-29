
// Local types
export * from './match';
export * from './user';
export * from './news';
export * from './prediction';

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
  accessLevel?: 'guest' | 'member';
  memberBenefits?: {
    message: string;
    features: string[];
  };
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database?: string;
  ml_service?: string;
}

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
