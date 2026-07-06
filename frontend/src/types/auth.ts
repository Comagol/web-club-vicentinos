/**
 * Frontend Auth Types
 *
 * Types for authentication context, API responses, and user data
 * modeled after the backend auth module (src/modules/auth/)
 */

/**
 * Authenticated user data
 * Mirrors the AccessPayload from backend JWT tokens
 */
export interface Usuario {
  id: string;
  email: string;
  roles: string[];
}

/**
 * Login request credentials
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login API response
 */
export interface LoginResponse {
  usuario: Usuario;
}

/**
 * Generic API response wrapper for auth endpoints
 */
export interface AuthApiResponse<T> {
  ok?: boolean;
  usuario?: T;
  error?: {
    code: string;
    message?: string;
  };
}

/**
 * Session/Auth state for context provider
 */
export interface AuthSession {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth context value
 */
export interface AuthContextType extends AuthSession {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}
