import React from 'react';
import { TeamMember } from '../../hooks/useTeamMembers';

interface TaskFilterBarProps {
  status?: 'all' | 'pendiente' | 'en_progreso' | 'completado';
  priority?: 'all' | 'baja' | 'media' | 'alta';
  assignee?: string;
  members: TeamMember[];
  onStatusChange?: (status: 'all' | 'pendiente' | 'en_progreso' | 'completado') => void;
  onPriorityChange?: (priority: 'all' | 'baja' | 'media' | 'alta') => void;
  onAssigneeChange?: (assignee: string) => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  status = 'all',
  priority = 'all',
  assignee = 'all',
  members,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'completado', label: 'Completado' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={status}
            onChange={(e) =>
              onStatusChange?.(
                e.target.value as
                  | 'all'
                  | 'pendiente'
                  | 'en_progreso'
                  | 'completado',
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            value={priority}
            onChange={(e) =>
              onPriorityChange?.(
                e.target.value as 'all' | 'baja' | 'media' | 'alta',
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Asignado a
          </label>
          <select
            value={assignee}
            onChange={(e) => onAssigneeChange?.(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
          >
            <option value="all">Todos</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.nombre} {member.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
