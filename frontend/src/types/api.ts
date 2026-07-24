// Base response wrapper for all API calls
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Error response
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

// Paginated list response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
