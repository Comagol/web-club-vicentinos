import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { reservaService } from '../services/api';
import { Espacio } from '../types/models';

export interface UseSubcomisionEspaciosReturn {
  espacios: Espacio[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface CacheData {
  espacios: Espacio[] | null;
  timestamp: number;
}

export const useSubcomisionEspacios = (ttlMs: number = 10 * 60 * 1000): UseSubcomisionEspaciosReturn => {
  const { usuario } = useAuth();
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<CacheData>({
    espacios: null,
    timestamp: 0,
  });

  const isCacheValid = useCallback(() => {
    if (!cacheRef.current.espacios) return false;
    const now = Date.now();
    return now - cacheRef.current.timestamp < ttlMs;
  }, [ttlMs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchEspacios = useCallback(async () => {
    if (isCacheValid()) {
      setEspacios(cacheRef.current.espacios || []);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await reservaService.getEspacios();
      const espaciosData = response.data.data;

      cacheRef.current = {
        espacios: espaciosData,
        timestamp: Date.now(),
      };

      setEspacios(espaciosData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch spaces';
      setError(errorMessage);
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  }, [isCacheValid]);

  const refetch = useCallback(async () => {
    cacheRef.current = {
      espacios: null,
      timestamp: 0,
    };
    await fetchEspacios();
  }, [fetchEspacios]);

  useEffect(() => {
    if (usuario && (usuario.roles.includes('subcomision') || usuario.roles.includes('admin'))) {
      fetchEspacios();
    }
  }, [usuario, fetchEspacios]);

  return {
    espacios,
    loading,
    error,
    refetch,
    clearError,
  };
};
