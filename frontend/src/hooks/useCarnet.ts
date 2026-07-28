import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { carnetService } from '../services/api';
import { Carnet } from '../types/models';

export interface UseCarnetReturn {
  data: Carnet | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface CacheData {
  data: Carnet | null;
  timestamp: number;
}

export const useCarnet = (ttlMs: number = 10 * 60 * 1000): UseCarnetReturn => {
  const { usuario } = useAuth();
  const [data, setData] = useState<Carnet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<CacheData>({
    data: null,
    timestamp: 0,
  });

  const isCacheValid = useCallback(() => {
    if (!cacheRef.current.data) return false;
    const now = Date.now();
    return now - cacheRef.current.timestamp < ttlMs;
  }, [ttlMs]);

  const fetchData = useCallback(async () => {
    if (!usuario?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await carnetService.getCarnet(usuario.id);
      const carnetData = response.data;

      // Update cache
      cacheRef.current = {
        data: carnetData,
        timestamp: Date.now(),
      };

      setData(carnetData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch carnet data';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  const refetch = useCallback(async () => {
    // Clear cache to force refetch
    cacheRef.current = {
      data: null,
      timestamp: 0,
    };
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!usuario?.id) {
      setData(null);
      setError(null);
      return;
    }

    // Return cached data if valid
    if (isCacheValid()) {
      setData(cacheRef.current.data);
      return;
    }

    // Fetch new data
    fetchData();
  }, [usuario?.id, isCacheValid, fetchData]);

  return { data, loading, error, refetch };
};
