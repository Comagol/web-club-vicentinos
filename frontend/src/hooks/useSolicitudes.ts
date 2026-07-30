import { useState, useEffect, useCallback } from 'react';
import { solicitudService } from '../services/api';
import { Solicitud } from '../types/models';

export interface SolicitudFilters {
  tipo?: 'reserva' | 'actividad' | 'espacios_subcomision';
  estado?: 'pendiente' | 'aprobado' | 'rechazado';
}

export interface SolicitudStats {
  total: number;
  pendientes: number;
  aprobadasHoy: number;
  rechazadasHoy: number;
}

const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr?.split('T')[0] === today;
};

export const useSolicitudes = (filters?: SolicitudFilters) => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [stats, setStats] = useState<SolicitudStats>({
    total: 0,
    pendientes: 0,
    aprobadasHoy: 0,
    rechazadasHoy: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await solicitudService.getSolicitudes(filters);
      const responseData = response.data?.data || response.data;
      const items = Array.isArray(responseData)
        ? responseData
        : (responseData?.items || []);

      const sorted = [...items].sort(
        (a: Solicitud, b: Solicitud) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
      );

      setSolicitudes(sorted);

      const newStats: SolicitudStats = {
        total: sorted.length,
        pendientes: sorted.filter((s: Solicitud) => s.estado === 'pendiente').length,
        aprobadasHoy: sorted.filter(
          (s: Solicitud) => s.estado === 'aprobado' && isToday(s.fechaCreacion),
        ).length,
        rechazadasHoy: sorted.filter(
          (s: Solicitud) => s.estado === 'rechazado' && isToday(s.fechaCreacion),
        ).length,
      };
      setStats(newStats);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching requests';
      setError(errorMsg);
      console.error('Error fetching solicitudes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.tipo, filters?.estado]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const refresh = useCallback(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const updateSolicitudLocal = useCallback((updated: Solicitud) => {
    setSolicitudes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }, []);

  return {
    solicitudes,
    stats,
    isLoading,
    error,
    refresh,
    updateSolicitudLocal,
  };
};
