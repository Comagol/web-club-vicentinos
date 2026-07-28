import { useState, useRef, useEffect, useCallback } from 'react';
import { carnetService } from '../services/api';
import { Carnet } from '../types/models';

export interface UseCarnetPublicReturn {
  data: Carnet | null;
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
  refetch: () => Promise<void>;
}

interface CacheData {
  data: Carnet | null;
  timestamp: number;
}

/**
 * Hook for fetching public carnet data (no authentication required)
 * Used for QR code verification page
 */
export const useCarnetPublic = (carnetId: string | undefined, ttlMs: number = 10 * 60 * 1000): UseCarnetPublicReturn => {
  const [data, setData] = useState<Carnet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    if (!carnetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await carnetService.getCarnetPublic(carnetId);
      const carnetData = response.data.data;

      // Update cache
      cacheRef.current = {
        data: carnetData,
        timestamp: Date.now(),
      };

      setData(carnetData);
    } catch (err) {
      let errorMessage = 'Error al verificar carnet';

      if (err instanceof Error) {
        if (err.message.includes('404')) {
          errorMessage = 'Carnet no encontrado';
        } else if (err.message.includes('400')) {
          errorMessage = 'Formato de carnet inválido';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [carnetId]);

  const refetch = useCallback(async () => {
    // Clear cache to force refetch
    cacheRef.current = {
      data: null,
      timestamp: 0,
    };
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!carnetId) {
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
  }, [carnetId, isCacheValid, fetchData]);

  // isValid: true if carnet is habilitado
  const isValid = data?.estado === 'habilitado';

  return { data, isLoading, error, isValid, refetch };
};
