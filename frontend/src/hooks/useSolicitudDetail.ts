import { useState, useEffect, useCallback } from 'react';
import { solicitudService } from '../services/api';
import { Solicitud } from '../types/models';

export interface UseSolicitudDetailReturn {
  solicitud: Solicitud | null;
  isLoading: boolean;
  error: string | null;
  aprobar: (nota?: string) => Promise<Solicitud>;
  rechazar: (nota: string) => Promise<Solicitud>;
}

export const useSolicitudDetail = (
  initialSolicitud: Solicitud | null,
): UseSolicitudDetailReturn => {
  const [solicitud, setSolicitud] = useState<Solicitud | null>(initialSolicitud);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSolicitud(initialSolicitud);
    setError(null);
  }, [initialSolicitud]);

  const aprobar = useCallback(
    async (nota?: string) => {
      if (!solicitud) {
        throw new Error('No solicitud selected');
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await solicitudService.aprobarSolicitud(solicitud.id, nota);
        const updated = (response.data?.data || response.data) as Solicitud;
        setSolicitud(updated);
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al aprobar la solicitud';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [solicitud],
  );

  const rechazar = useCallback(
    async (nota: string) => {
      if (!solicitud) {
        throw new Error('No solicitud selected');
      }
      if (!nota || !nota.trim()) {
        const message = 'Debe indicar un motivo de rechazo';
        setError(message);
        throw new Error(message);
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await solicitudService.rechazarSolicitud(solicitud.id, nota);
        const updated = (response.data?.data || response.data) as Solicitud;
        setSolicitud(updated);
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al rechazar la solicitud';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [solicitud],
  );

  return {
    solicitud,
    isLoading,
    error,
    aprobar,
    rechazar,
  };
};
