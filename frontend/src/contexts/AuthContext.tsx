import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AuthContextType, Usuario, PasswordResetResult } from '../types/auth';
import { ApiResponse } from '../types/api';
import client from '../api/client';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await client.post<ApiResponse<{ usuario: Usuario; token: string }>>('/auth/login', {
        email,
        password,
      });
      // Token is automatically extracted and stored by API client interceptor
      // We just need to extract and set the usuario
      setUsuario(response.data.data.usuario);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await client.post('/auth/logout');
      localStorage.removeItem('authToken');
      setUsuario(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      // Clear token even if logout API call fails
      localStorage.removeItem('authToken');
      setUsuario(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check localStorage for token FIRST before calling API
      const token = localStorage.getItem('authToken');

      if (!token) {
        // No token exists - user is not authenticated
        setUsuario(null);
        return;
      }

      // Token exists - try to restore session via /auth/me
      // API client will automatically inject the token in the Authorization header
      const response = await client.get<ApiResponse<Usuario>>('/auth/me');
      setUsuario(response.data.data);
    } catch (err) {
      // On error during restore, clear usuario but don't persist the error
      // (restore is automatic on app load, so we don't want to show error UI)
      // Note: A1's 401 interceptor already clears the token and redirects to /login
      setUsuario(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<PasswordResetResult> => {
    setError(null);
    try {
      await client.post('/auth/password-reset-request', { email });
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request password reset';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<PasswordResetResult> => {
    setError(null);
    try {
      await client.post('/auth/password-reset', { token, newPassword });
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const value: AuthContextType = {
    usuario,
    isLoading,
    isAuthenticated: usuario !== null,
    error,
    login,
    logout,
    restoreSession,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
