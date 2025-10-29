// Shared types used across multiple domains
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CacheConfig {
  duration: number;
  enabled: boolean;
}