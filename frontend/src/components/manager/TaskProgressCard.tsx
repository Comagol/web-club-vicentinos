import React, { useState } from 'react';
import { Tarea } from '../../types/models';

interface TaskProgressCardProps {
  task: Tarea;
  assigneeName?: string;
  onStatusChange?: (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'completado') => void;
}

export const TaskProgressCard: React.FC<TaskProgressCardProps> = ({
  task,
  assigneeName = 'Sin asignar',
  onStatusChange,
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado':
        return 'bg-green-50 border-green-200';
      case 'en_progreso':
        return 'bg-blue-50 border-blue-200';
      case 'pendiente':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleStatusChange = async (newStatus: 'pendiente' | 'en_progreso' | 'completado') => {
    setIsChangingStatus(true);
    try {
      await onStatusChange?.(task.id, newStatus);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const isOverdue =
    task.estado !== 'completado' &&
    new Date(task.fechaVencimiento) < new Date();

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${getStatusColor(
        task.estado,
      )}`}
    >
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 mb-1">{task.titulo}</h3>
        <p className="text-sm text-gray-600">{task.descripcion}</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-600">Asignado a</p>
          <p className="font-semibold text-gray-900">{assigneeName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.prioridad)}`}>
          {task.prioridad.charAt(0).toUpperCase() + task.prioridad.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-600">
            Vencimiento:{' '}
            <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {new Date(task.fechaVencimiento).toLocaleDateString('es-AR')}
            </span>
          </p>
          {isOverdue && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Vencida</span>}
        </div>
      </div>

      {/* Status Update Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange('pendiente')}
          disabled={isChangingStatus || task.estado === 'pendiente'}
          className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
            task.estado === 'pendiente'
              ? 'bg-gray-400 text-white cursor-default'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Pendiente
        </button>
        <button
          onClick={() => handleStatusChange('en_progreso')}
          disabled={isChangingStatus || task.estado === 'en_progreso'}
          className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
            task.estado === 'en_progreso'
              ? 'bg-blue-500 text-white cursor-default'
              : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
          }`}
        >
          En progreso
        </button>
        <button
          onClick={() => handleStatusChange('completado')}
          disabled={isChangingStatus || task.estado === 'completado'}
          className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
            task.estado === 'completado'
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-green-200 text-green-900 hover:bg-green-300'
          }`}
        >
          Completado
        </button>
      </div>
    </div>
  );
};
