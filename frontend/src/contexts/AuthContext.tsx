import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AuthContextType, Usuario } from '../types/auth';
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
      setUsuario(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
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
    } catch {
      setUsuario(null);
    } finally {
      setIsLoading(false);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
