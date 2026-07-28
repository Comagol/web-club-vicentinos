import { useState, useCallback, useEffect } from 'react';
import { reservaService } from '../services/api';
import { Reserva, Espacio } from '../types/models';
import { useAuth } from './useAuth';

export const useReservationList = () => {
  const { usuario } = useAuth();
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEspacios = useCallback(async () => {
    try {
      const response = await reservaService.getEspacios();
      const data = response.data?.data;
      setEspacios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch espacios:', err);
      setEspacios([]);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    if (!usuario?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await reservaService.getReservas(usuario.id);
      // Handle PaginatedResponse structure
      const responseData = response.data?.data;
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        const data = (responseData as any).data;
        setReservations(Array.isArray(data) ? data : []);
      } else if (Array.isArray(responseData)) {
        setReservations(responseData);
      } else {
        setReservations([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar reservas';
      setError(message);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.id]);

  const cancelReservation = useCallback(
    async (reservaId: string) => {
      try {
        setError(null);
        await reservaService.cancelarReserva(reservaId);
        // Remove the cancelled reservation from the list
        setReservations((prev) => prev.filter((r) => r.id !== reservaId));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cancelar reserva';
        setError(message);
        throw err;
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    await fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    fetchEspacios();
    fetchReservations();
  }, [fetchEspacios, fetchReservations]);

  return {
    reservations,
    espacios,
    isLoading,
    error,
    refetch,
    cancelReservation,
  };
};
