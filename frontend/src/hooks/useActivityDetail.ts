import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { actividadService } from '../services/api';
import { Actividad } from '../types/models';

export interface UseActivityDetailReturn {
  actividad: Actividad | null;
  loading: boolean;
  error: string | null;
  fetchActivityDetail: (actividadId: string) => Promise<void>;
  enrollInActivity: (actividadId: string) => Promise<void>;
  isEnrolling: boolean;
  enrollmentError: string | null;
  clearErrors: () => void;
}

export const useActivityDetail = (): UseActivityDetailReturn => {
  const { usuario } = useAuth();
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setEnrollmentError(null);
  }, []);

  const fetchActivityDetail = useCallback(async (actividadId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await actividadService.getActividad(actividadId);
      setActividad(response.data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activity details';
      setError(errorMessage);
      setActividad(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const enroll = useCallback(async (actividadId: string) => {
    if (!usuario?.id) {
      setEnrollmentError('User not authenticated');
      throw new Error('User not authenticated');
    }

    setIsEnrolling(true);
    setEnrollmentError(null);

    try {
      await actividadService.inscribirse(usuario.id, actividadId);

      // Refresh the activity detail to get updated inscriptosCount
      await fetchActivityDetail(actividadId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in activity';
      setEnrollmentError(errorMessage);
      throw err;
    } finally {
      setIsEnrolling(false);
    }
  }, [usuario?.id, fetchActivityDetail]);

  return {
    actividad,
    loading,
    error,
    fetchActivityDetail,
    enrollInActivity: enroll,
    isEnrolling,
    enrollmentError,
    clearErrors,
  };
};
