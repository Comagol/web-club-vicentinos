import { useState, useCallback, useEffect, useMemo } from 'react';
import { tareaService } from '../services/api';
import { Tarea } from '../types/models';
import { useAuth } from './useAuth';

interface TaskFilters {
  estado?: string;
  prioridad?: string;
}

export const useEmployeeTasks = () => {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const fetchTareas = useCallback(async () => {
    if (!usuario?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await tareaService.getTareas({ asignadoA: usuario.id });
      // Handle PaginatedResponse structure
      const responseData = response.data?.data;
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        const data = (responseData as any).data;
        setTareas(Array.isArray(data) ? data : []);
      } else if (Array.isArray(responseData)) {
        setTareas(responseData);
      } else {
        setTareas([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tareas';
      setError(message);
      setTareas([]);
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.id]);

  const filteredTareas = useMemo(() => {
    return tareas.filter((tarea) => {
      if (filters.estado && tarea.estado !== filters.estado) {
        return false;
      }
      if (filters.prioridad && tarea.prioridad !== filters.prioridad) {
        return false;
      }
      return true;
    });
  }, [tareas, filters]);

  const applyFilters = useCallback((estado?: string, prioridad?: string) => {
    setFilters({
      estado: estado || undefined,
      prioridad: prioridad || undefined,
    });
  }, []);

  const refetch = useCallback(async () => {
    await fetchTareas();
  }, [fetchTareas]);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  return {
    tareas,
    filteredTareas,
    isLoading,
    error,
    filters,
    applyFilters,
    refetch,
  };
};
