import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { reservaService } from '../services/api';
import { Espacio, Reserva } from '../types/models';

export interface UseReservationsReturn {
  espacios: Espacio[];
  disponibilidad: any;
  loading: boolean;
  error: string | null;
  getEspacios: () => Promise<void>;
  getDisponibilidad: (espacioId: string, fecha: string) => Promise<void>;
  crearReserva: (data: Omit<Reserva, 'id' | 'socioId' | 'createdAt'>) => Promise<Reserva>;
  clearError: () => void;
}

interface CacheData {
  espacios: Espacio[] | null;
  timestamp: number;
}

export const useReservations = (ttlMs: number = 10 * 60 * 1000): UseReservationsReturn => {
  const { usuario } = useAuth();
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<any>(null);
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

  const clearError = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    setError(null);
  }, []);

  const fetchEspacios = useCallback(async () => {
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
  }, []);

  const fetchDisponibilidad = useCallback(async (espacioId: string, fecha: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reservaService.getDisponibilidad(espacioId, fecha);
      setDisponibilidad(response.data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch availability';
      setError(errorMessage);
      setDisponibilidad(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReserva = useCallback(async (data: Omit<Reserva, 'id' | 'socioId' | 'createdAt'>) => {
    if (!usuario?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await reservaService.crearReserva(usuario.id, data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    if (!usuario?.id) {
      setEspacios([]);
      setError(null);
      return;
    }

    // Return cached data if valid
    if (isCacheValid()) {
      setEspacios(cacheRef.current.espacios || []);
      return;
    }

    // Fetch new data
    fetchEspacios();
  }, [usuario?.id, isCacheValid, fetchEspacios]);

  return {
    espacios,
    disponibilidad,
    loading,
    error,
    getEspacios: fetchEspacios,
    getDisponibilidad: fetchDisponibilidad,
    crearReserva: createReserva,
    clearError,
  };
};
