import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { socioService } from '../services/api';

export interface Payment {
  id: string;
  amount: number;
  date: string;
  concept: string;
}

export interface CurrentFeeStatus {
  status: 'al día' | 'vencida' | 'vencida_hace_meses';
  dueDate: string;
  amount: number;
}

export interface FeesData {
  currentStatus: CurrentFeeStatus;
  paymentHistory: Payment[];
}

export interface UseFeeDataReturn {
  data: FeesData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface CacheData {
  data: FeesData | null;
  timestamp: number;
}

export const useFeesData = (ttlMs: number = 5 * 60 * 1000): UseFeeDataReturn => {
  const { usuario } = useAuth();
  const [data, setData] = useState<FeesData | null>(null);
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
      const response = await socioService.getCuotas(usuario.id);
      const cuotasData = response.data.data;

      // Parse response to extract current status and payment history
      // For now, we'll create a mock structure from the response
      const feesData: FeesData = {
        currentStatus: {
          status: cuotasData?.currentStatus?.status || 'al día',
          dueDate: cuotasData?.currentStatus?.dueDate || new Date().toISOString().split('T')[0],
          amount: cuotasData?.currentStatus?.amount || 0,
        },
        paymentHistory: cuotasData?.paymentHistory || [],
      };

      // Update cache
      cacheRef.current = {
        data: feesData,
        timestamp: Date.now(),
      };

      setData(feesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fees data';
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
