import React from 'react';
import { Tarea } from '../../types/models';

interface TaskCardProps {
  tarea: Tarea;
  onViewDetails: (tareaId: string) => void;
}

const getPriorityColor = (prioridad: string): string => {
  switch (prioridad) {
    case 'alta':
      return 'bg-red-100 text-red-800';
    case 'media':
      return 'bg-amber-100 text-amber-800';
    case 'baja':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (estado: string): string => {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente';
    case 'en_progreso':
      return 'En Progreso';
    case 'completado':
      return 'Completado';
    default:
      return estado;
  }
};

const formatDate = (dateString: string): string => {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const monthNames = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    return `${day} ${monthNames[month - 1]}`;
  } catch {
    return dateString;
  }
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const TaskCard: React.FC<TaskCardProps> = ({ tarea, onViewDetails }) => {
  return (
    <div className="bg-white border border-neutral-300 rounded-lg hover:shadow-md transition-shadow duration-200">
      {/* Header with Title and Priority Badge */}
      <div className="flex justify-between items-start gap-3 p-4 border-b border-neutral-200">
        <h3 className="font-semibold text-sm text-neutral-900 flex-1">
          {tarea.titulo}
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getPriorityColor(tarea.prioridad)}`}>
          {capitalizeFirstLetter(tarea.prioridad)}
        </span>
      </div>

      {/* Body with Status and Due Date */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-600">Estado:</span>
          <span className="font-medium text-neutral-900">
            {getStatusLabel(tarea.estado)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-600">Vencimiento:</span>
          <span className="font-medium text-neutral-900">
            {formatDate(tarea.fechaVencimiento)}
          </span>
        </div>
      </div>

      {/* Footer with Button */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={() => onViewDetails(tarea.id)}
          className="w-full px-3 py-2 text-sm font-medium text-white bg-navy-800 rounded hover:bg-navy-900 transition-colors duration-150"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
