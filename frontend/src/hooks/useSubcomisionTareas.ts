import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { tareaService } from '../services/api';
import { Tarea } from '../types/models';
import { ApiResponse, PaginatedResponse } from '../types/api';

export interface UseSubcomisionTareasReturn {
  tareas: Tarea[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTaskStatus: (tareaId: string, estado: Tarea['estado']) => Promise<void>;
  clearError: () => void;
  filteredTareas: (estado?: Tarea['estado']) => Tarea[];
}

interface CacheData {
  tareas: Tarea[] | null;
  timestamp: number;
}

export const useSubcomisionTareas = (ttlMs: number = 5 * 60 * 1000): UseSubcomisionTareasReturn => {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<CacheData>({
    tareas: null,
    timestamp: 0,
  });

  const isCacheValid = useCallback(() => {
    if (!cacheRef.current.tareas) return false;
    const now = Date.now();
    return now - cacheRef.current.timestamp < ttlMs;
  }, [ttlMs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchTareas = useCallback(async () => {
    if (isCacheValid()) {
      setTareas(cacheRef.current.tareas || []);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await tareaService.getTareas();
      const apiResponse = response.data as ApiResponse<PaginatedResponse<Tarea>>;
      const tareasData = Array.isArray(apiResponse.data) ? apiResponse.data : apiResponse.data.items || [];

      cacheRef.current = {
        tareas: tareasData,
        timestamp: Date.now(),
      };

      setTareas(tareasData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  }, [isCacheValid]);

  const updateTaskStatus = useCallback(
    async (tareaId: string, estado: Tarea['estado']) => {
      try {
        setError(null);
        await tareaService.actualizarTarea(tareaId, { estado });

        setTareas((prev) =>
          prev.map((tarea) =>
            tarea.id === tareaId ? { ...tarea, estado } : tarea
          )
        );

        cacheRef.current = {
          tareas: null,
          timestamp: 0,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    cacheRef.current = {
      tareas: null,
      timestamp: 0,
    };
    await fetchTareas();
  }, [fetchTareas]);

  const filteredTareas = useCallback(
    (estado?: Tarea['estado']) => {
      if (!estado) return tareas;
      return tareas.filter((tarea) => tarea.estado === estado);
    },
    [tareas]
  );

  useEffect(() => {
    if (usuario && (usuario.roles.includes('subcomision') || usuario.roles.includes('admin'))) {
      fetchTareas();
    }
  }, [usuario, fetchTareas]);

  return {
    tareas,
    loading,
    error,
    refetch,
    updateTaskStatus,
    clearError,
    filteredTareas,
  };
};
