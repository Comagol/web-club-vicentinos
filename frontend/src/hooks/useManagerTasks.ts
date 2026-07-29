import { useState, useEffect, useCallback } from 'react';
import { tareaService } from '../services/api';
import { Tarea } from '../types/models';

export interface TaskFilters {
  estado?: 'pendiente' | 'en_progreso' | 'completado';
  prioridad?: 'baja' | 'media' | 'alta';
  asignadoA?: string;
}

export interface TaskStats {
  total: number;
  pendiente: number;
  en_progreso: number;
  completado: number;
  vencidas: number;
}

export const useManagerTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Tarea[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pendiente: 0,
    en_progreso: 0,
    completado: 0,
    vencidas: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tareaService.getTareas(filters);
      const responseData = response.data?.data || response.data;
      const tareas = Array.isArray(responseData) ? responseData : (responseData?.items || []);

      setTasks(tareas);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const newStats: TaskStats = {
        total: tareas.length,
        pendiente: tareas.filter((t: Tarea) => t.estado === 'pendiente').length,
        en_progreso: tareas.filter((t: Tarea) => t.estado === 'en_progreso').length,
        completado: tareas.filter((t: Tarea) => t.estado === 'completado').length,
        vencidas: tareas.filter(
          (t: Tarea) =>
            t.estado !== 'completado' &&
            new Date(t.fechaVencimiento) < new Date(today),
        ).length,
      };
      setStats(newStats);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error fetching tasks';
      setError(errorMsg);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create new task
  const createTask = useCallback(
    async (taskData: Omit<Tarea, 'id' | 'createdAt'>) => {
      setError(null);
      try {
        const response = await tareaService.crearTarea(taskData);
        const newTask = (response.data?.data || response.data) as Tarea;
        setTasks((prev) => [newTask, ...prev]);
        return newTask;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Error creating task';
        setError(errorMsg);
        throw err;
      }
    },
    [],
  );

  // Update task
  const updateTask = useCallback(async (taskId: string, data: Partial<Tarea>) => {
    setError(null);
    try {
      const response = await tareaService.actualizarTarea(taskId, data);
      const updated = (response.data?.data || response.data) as Tarea;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t)),
      );
      return updated;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error updating task';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Assign task to team member
  const assignTask = useCallback(
    async (taskId: string, empleadoId: string) => {
      setError(null);
      try {
        const response = await tareaService.asignarTarea(taskId, empleadoId);
        const assigned = (response.data?.data || response.data) as Tarea;
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? assigned : t)),
        );
        return assigned;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Error assigning task';
        setError(errorMsg);
        throw err;
      }
    },
    [],
  );

  // Delete task by updating status to completado (soft delete)
  const completeTask = useCallback(async (taskId: string) => {
    return updateTask(taskId, { estado: 'completado' });
  }, [updateTask]);

  // Mark task as in progress
  const startTask = useCallback(async (taskId: string) => {
    return updateTask(taskId, { estado: 'en_progreso' });
  }, [updateTask]);

  // Refresh tasks
  const refresh = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    stats,
    isLoading,
    error,
    createTask,
    updateTask,
    assignTask,
    completeTask,
    startTask,
    refresh,
  };
};
