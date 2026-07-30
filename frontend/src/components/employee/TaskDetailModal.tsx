import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Tarea } from '../../types/models';

interface TaskDetailModalProps {
  isOpen: boolean;
  tarea: Tarea | null;
  onClose: () => void;
  onStatusUpdate: (taskId: string, newStatus: string) => Promise<void>;
}

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

const getPriorityLabel = (prioridad: string): string => {
  switch (prioridad) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Media';
    case 'baja':
      return 'Baja';
    default:
      return prioridad;
  }
};

const getPriorityColor = (prioridad: string): string => {
  switch (prioridad) {
    case 'alta':
      return 'text-red-600';
    case 'media':
      return 'text-amber-600';
    case 'baja':
      return 'text-green-600';
    default:
      return 'text-neutral-600';
  }
};

const formatFullDate = (dateString: string): string => {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const dayName = [
      'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
    ][date.getDay()];
    return `${dayName}, ${day} de ${monthNames[month - 1]} de ${year}`;
  } catch {
    return dateString;
  }
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  tarea,
  onClose,
  onStatusUpdate,
}) => {
  const [successMessage, setSuccessMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = useCallback(
    async (newStatus: string) => {
      if (!tarea) return;

      try {
        setIsUpdating(true);
        await onStatusUpdate(tarea.id, newStatus);
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
      } finally {
        setIsUpdating(false);
      }
    },
    [tarea, onStatusUpdate]
  );

  if (!isOpen || !tarea) {
    return null;
  }

  const statusOptions = ['pendiente', 'en_progreso', 'completado'];

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">
              Detalles de Tarea
            </h2>
            <button
              onClick={onClose}
              className="p-0 hover:opacity-70 transition-opacity"
              aria-label="Close modal"
            >
              <X size={20} className="text-neutral-700" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Title Section */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">
                {tarea.titulo}
              </h3>
            </div>

            {/* Description Section */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Descripción
              </label>
              <p className="text-sm text-neutral-600">
                {tarea.descripcion}
              </p>
            </div>

            {/* Priority and Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Prioridad
                </label>
                <p className={`text-sm font-medium ${getPriorityColor(tarea.prioridad)}`}>
                  {getPriorityLabel(tarea.prioridad)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Estado
                </label>
                <p className="text-sm font-medium text-neutral-900">
                  {getStatusLabel(tarea.estado)}
                </p>
              </div>
            </div>

            {/* Due Date Section */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Fecha de Vencimiento
              </label>
              <p className="text-sm text-neutral-600">
                {formatFullDate(tarea.fechaVencimiento)}
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                Estado actualizado exitosamente
              </div>
            )}

            {/* Status Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700 mb-3">
                Cambiar Estado
              </p>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={tarea.estado === status || isUpdating}
                    className={`w-full px-4 py-2 rounded font-medium text-sm transition-all ${
                      tarea.estado === status
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : isUpdating
                        ? 'bg-blue-600 text-white opacity-75 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-navy-800 text-white rounded font-medium text-sm hover:bg-navy-900 transition-colors active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

TaskDetailModal.displayName = 'TaskDetailModal';
