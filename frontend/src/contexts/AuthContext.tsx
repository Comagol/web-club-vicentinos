import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AuthContextType, Usuario, PasswordResetResult } from '../types/auth';
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
      const response = await client.post<{ usuario: Usuario }>('/auth/login', {
        email,
        password,
      });
      setUsuario(response.data.usuario);
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
      const response = await client.get<{ usuario: Usuario }>('/auth/me');
      setUsuario(response.data.usuario);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore session');
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
