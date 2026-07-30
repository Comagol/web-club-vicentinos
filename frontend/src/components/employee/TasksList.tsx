import React from 'react';
import { Tarea } from '../../types/models';
import { TaskCard } from './TaskCard';

interface TasksListProps {
  tareas: Tarea[];
  isLoading: boolean;
  onViewDetails: (tareaId: string) => void;
}

export const TasksList: React.FC<TasksListProps> = ({
  tareas,
  isLoading,
  onViewDetails,
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">Cargando tareas...</p>
      </div>
    );
  }

  // Show empty state
  if (tareas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">No hay tareas asignadas.</p>
      </div>
    );
  }

  // Sort tasks by fechaVencimiento in ascending order (nearest due date first)
  const sortedTareas = [...tareas].sort((a, b) => {
    return a.fechaVencimiento.localeCompare(b.fechaVencimiento);
  });

  // Render list of tasks
  return (
    <div className="space-y-3">
      {sortedTareas.map((tarea) => (
        <TaskCard
          key={tarea.id}
          tarea={tarea}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
