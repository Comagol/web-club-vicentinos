import React, { useState } from 'react';

export type StatusFilter = 'all' | 'pendiente' | 'aprobado' | 'rechazado';
export type TipoFilter = 'all' | 'reserva' | 'actividad' | 'espacios_subcomision';

interface RequestFilterBarProps {
  status: StatusFilter;
  tipo: TipoFilter;
  search: string;
  onApply: (filters: { status: StatusFilter; tipo: TipoFilter; search: string }) => void;
  onClear: () => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'rechazado', label: 'Rechazado' },
];

const tipoOptions: { value: TipoFilter; label: string }[] = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'reserva', label: 'Reserva' },
  { value: 'actividad', label: 'Actividad' },
  { value: 'espacios_subcomision', label: 'Espacios (Subcomisión)' },
];

export const RequestFilterBar: React.FC<RequestFilterBarProps> = ({
  status,
  tipo,
  search,
  onApply,
  onClear,
}) => {
  const [localStatus, setLocalStatus] = useState<StatusFilter>(status);
  const [localTipo, setLocalTipo] = useState<TipoFilter>(tipo);
  const [localSearch, setLocalSearch] = useState(search);

  const handleApply = () => {
    onApply({ status: localStatus, tipo: localTipo, search: localSearch });
  };

  const handleClear = () => {
    setLocalStatus('all');
    setLocalTipo('all');
    setLocalSearch('');
    onClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="request-filter-bar">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filter-status" className="block text-sm font-semibold text-gray-700 mb-2">
            Estado
          </label>
          <select
            id="filter-status"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value as StatusFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-tipo" className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo
          </label>
          <select
            id="filter-tipo"
            value={localTipo}
            onChange={(e) => setLocalTipo(e.target.value as TipoFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800"
          >
            {tipoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-search" className="block text-sm font-semibold text-gray-700 mb-2">
            Solicitante
          </label>
          <input
            id="filter-search"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-navy-800 text-white rounded-lg font-semibold hover:opacity-90"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};
