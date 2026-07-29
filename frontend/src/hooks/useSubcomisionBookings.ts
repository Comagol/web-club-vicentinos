import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { reservaService } from '../services/api';
import { Reserva } from '../types/models';

export interface UseSubcomisionBookingsReturn {
  reservas: Reserva[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  cancelReservation: (reservaId: string) => Promise<void>;
  clearError: () => void;
}

export const useSubcomisionBookings = (espacioId?: string): UseSubcomisionBookingsReturn => {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!espacioId) {
      setReservas([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reservaService.getEspacios();
      setReservas([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(errorMessage);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, [espacioId]);

  const cancelReservation = useCallback(
    async (reservaId: string) => {
      try {
        setError(null);
        await reservaService.cancelarReserva(reservaId);
        setReservas((prev) => prev.filter((r) => r.id !== reservaId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to cancel reservation';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    await fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (usuario && (usuario.roles.includes('subcomision') || usuario.roles.includes('admin'))) {
      fetchBookings();
    }
  }, [usuario, espacioId, fetchBookings]);

  return {
    reservas,
    loading,
    error,
    refetch,
    cancelReservation,
    clearError,
  };
};
