import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Tarea } from '../../types/models';

interface TasksListProps {
  tareas: Tarea[];
  loading: boolean;
  error?: string | null;
  onStatusChange: (tareaId: string, nuevoEstado: Tarea['estado']) => Promise<void>;
  filterStatus?: 'all' | Tarea['estado'];
}

const STATUS_ICONS = {
  pendiente: <AlertCircle size={18} className="text-yellow-600" />,
  en_progreso: <Clock size={18} className="text-blue-600" />,
  completado: <CheckCircle2 size={18} className="text-green-600" />,
};

const PRIORITY_COLORS = {
  baja: 'bg-green-100 text-green-700',
  media: 'bg-yellow-100 text-yellow-700',
  alta: 'bg-red-100 text-red-700',
};

const getPriorityLabel = (prioridad: Tarea['prioridad']): string => {
  const labels = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
  };
  return labels[prioridad];
};

const getStatusLabel = (estado: Tarea['estado']): string => {
  const labels = {
    pendiente: 'Pendiente',
    en_progreso: 'En progreso',
    completado: 'Completado',
  };
  return labels[estado];
};

const getNextStatus = (estado: Tarea['estado']): Tarea['estado'] => {
  const transitions: Record<Tarea['estado'], Tarea['estado']> = {
    pendiente: 'en_progreso',
    en_progreso: 'completado',
    completado: 'pendiente',
  };
  return transitions[estado];
};

export const TasksList: React.FC<TasksListProps> = ({
  tareas,
  loading,
  error,
  onStatusChange,
  filterStatus = 'all',
}) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const filteredTareas = tareas.filter(
    (tarea: Tarea) => filterStatus === 'all' || tarea.estado === filterStatus
  );

  const handleStatusClick = async (tareaId: string, currentStatus: Tarea['estado']) => {
    try {
      setUpdating(tareaId);
      setUpdateError(null);
      const nuevoEstado = getNextStatus(currentStatus);
      await onStatusChange(tareaId, nuevoEstado);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Error updating task');
    } finally {
      setUpdating(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-500">Error al cargar tareas</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-neutral-100 rounded-lg animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!filteredTareas || filteredTareas.length === 0) {
    return (
      <div className="p-6 text-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-600 font-500">
          No hay tareas {filterStatus !== 'all' ? `en estado ${filterStatus}` : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updateError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{updateError}</p>
        </div>
      )}

      {filteredTareas.map((tarea: Tarea) => (
        <div
          key={tarea.id}
          className="p-4 border-[0.5px] border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-600 text-navy-800 flex-1">{tarea.titulo}</h4>
              <span
                className={`flex-shrink-0 text-xs font-500 px-3 py-1 rounded ${
                  PRIORITY_COLORS[tarea.prioridad]
                }`}
              >
                {getPriorityLabel(tarea.prioridad)}
              </span>
            </div>

            {tarea.descripcion && (
              <p className="text-sm text-neutral-600 line-clamp-2">{tarea.descripcion}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusClick(tarea.id, tarea.estado)}
                  disabled={updating === tarea.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={`Cambiar a: ${getStatusLabel(getNextStatus(tarea.estado))}`}
                >
                  {STATUS_ICONS[tarea.estado]}
                  <span className="text-xs font-500 text-neutral-700">
                    {getStatusLabel(tarea.estado)}
                  </span>
                </button>
              </div>

              {tarea.fechaVencimiento && (
                <p className="text-xs text-neutral-600">
                  Vencimiento:{' '}
                  <span className="font-500">
                    {new Date(tarea.fechaVencimiento).toLocaleDateString('es-AR')}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
