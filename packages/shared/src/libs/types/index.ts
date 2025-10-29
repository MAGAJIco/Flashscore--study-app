
// Shared types for cross-package use
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
