import React from 'react';

interface TaskFilterBarProps {
  filters: { estado?: string; prioridad?: string };
  onFilterChange: (estado?: string, prioridad?: string) => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const statusOptions = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Progreso', value: 'en_progreso' },
    { label: 'Completado', value: 'completado' },
  ];

  const priorityOptions = [
    { label: 'Baja', value: 'baja' },
    { label: 'Media', value: 'media' },
    { label: 'Alta', value: 'alta' },
  ];

  const handleStatusChange = (value: string) => {
    const newEstado = filters.estado === value ? undefined : value;
    onFilterChange(newEstado, filters.prioridad);
  };

  const handlePriorityChange = (value: string) => {
    const newPrioridad = filters.prioridad === value ? undefined : value;
    onFilterChange(filters.estado, newPrioridad);
  };

  const handleResetFilters = () => {
    onFilterChange(undefined, undefined);
  };

  const isFiltersActive = filters.estado !== undefined || filters.prioridad !== undefined;

  const getButtonClass = (isActive: boolean) => {
    const baseClass =
      'px-3 py-2 text-sm font-medium rounded-sm transition-all duration-150';

    if (isActive) {
      return `${baseClass} bg-navy-800 text-white`;
    } else {
      return `${baseClass} bg-neutral-100 text-neutral-700 hover:bg-neutral-200`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">Estado</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={getButtonClass(filters.estado === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">Prioridad</p>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePriorityChange(option.value)}
              className={getButtonClass(filters.prioridad === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {isFiltersActive && (
        <button
          onClick={handleResetFilters}
          className="w-full px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-sm transition-all duration-150 mt-4"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
