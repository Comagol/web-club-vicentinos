import React, { useMemo } from 'react';
import { Tarea } from '../../types/models';
import { TeamMember } from '../../hooks/useTeamMembers';
import { TaskProgressCard } from './TaskProgressCard';

interface TeamTasksListProps {
  tasks: Tarea[];
  members: TeamMember[];
  status?: 'all' | 'pendiente' | 'en_progreso' | 'completado';
  priority?: 'all' | 'baja' | 'media' | 'alta';
  assignee?: string;
  onStatusChange?: (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'completado') => void;
  isLoading?: boolean;
  sortBy?: 'dueDate' | 'priority';
}

export const TeamTasksList: React.FC<TeamTasksListProps> = ({
  tasks,
  members,
  status = 'all',
  priority = 'all',
  assignee = 'all',
  onStatusChange,
  isLoading = false,
  sortBy = 'dueDate',
}) => {
  // Create a map of member IDs to names
  const memberMap = useMemo(() => {
    const map = new Map<string, string>();
    members.forEach((member) => {
      map.set(member.id, `${member.nombre} ${member.apellido}`);
    });
    return map;
  }, [members]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter((t) => t.estado === status);
    }

    // Apply priority filter
    if (priority !== 'all') {
      filtered = filtered.filter((t) => t.prioridad === priority);
    }

    // Apply assignee filter
    if (assignee !== 'all') {
      filtered = filtered.filter((t) => t.asignadoA === assignee);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'dueDate') {
        return (
          new Date(a.fechaVencimiento).getTime() -
          new Date(b.fechaVencimiento).getTime()
        );
      } else {
        // Priority sorting: alta > media > baja
        const priorityOrder = { alta: 3, media: 2, baja: 1 };
        return (
          (priorityOrder[b.prioridad] || 0) - (priorityOrder[a.prioridad] || 0)
        );
      }
    });

    return sorted;
  }, [tasks, status, priority, assignee, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Cargando tareas...</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">No hay tareas que coincidan con los filtros</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskProgressCard
          key={task.id}
          task={task}
          assigneeName={memberMap.get(task.asignadoA) || 'Sin asignar'}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
