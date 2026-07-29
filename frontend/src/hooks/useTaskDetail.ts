import { useState, useCallback } from 'react';
import { tareaService } from '../services/api';
import { Tarea } from '../types/models';

export interface UseTaskDetailReturn {
  task: Tarea | null;
  isLoading: boolean;
  error: string | null;
  updateStatus(nuevoEstado: 'pendiente' | 'en_progreso' | 'completado'): Promise<void>;
  refetch(): Promise<void>;
}

export const useTaskDetail = (taskId: string | null): UseTaskDetailReturn => {
  const [task, setTask] = useState<Tarea | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (nuevoEstado: 'pendiente' | 'en_progreso' | 'completado') => {
      if (!taskId) {
        throw new Error('No task ID provided');
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await tareaService.actualizarTarea(taskId, {
          estado: nuevoEstado,
        });
        // Update the local task state with the updated response
        if (response.data?.data) {
          setTask(response.data.data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar tarea';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [taskId]
  );

  const refetch = useCallback(async () => {
    // Placeholder function for future implementation
    // Could be expanded to fetch the task details again
  }, []);

  return {
    task,
    isLoading,
    error,
    updateStatus,
    refetch,
  };
};
