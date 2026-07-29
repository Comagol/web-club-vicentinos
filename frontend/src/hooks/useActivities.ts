import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { actividadService } from '../services/api';
import { Actividad } from '../types/models';

export interface UseActivitiesReturn {
  actividades: Actividad[];
  loading: boolean;
  error: string | null;
  fetchActividades: () => Promise<void>;
  clearError: () => void;
}

export const useActivities = (): UseActivitiesReturn => {
  const { usuario } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    setError(null);
  }, []);

  const fetchActividades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await actividadService.getActividades();
      const actividadesData = response.data.data;

      // Handle both array and paginated response
      const actividadesList = Array.isArray(actividadesData)
        ? actividadesData
        : actividadesData.data || [];

      setActividades(actividadesList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
      setActividades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario?.id) {
      setActividades([]);
      setError(null);
      return;
    }

    fetchActividades();
  }, [usuario?.id, fetchActividades]);

  return {
    actividades,
    loading,
    error,
    fetchActividades,
    clearError,
  };
};
