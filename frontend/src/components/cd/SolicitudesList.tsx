import React from 'react';
import { Solicitud } from '../../types/models';
import { SolicitudCard } from './SolicitudCard';
import { StatusFilter, TipoFilter } from './RequestFilterBar';

interface SolicitudesListProps {
  solicitudes: Solicitud[];
  isLoading: boolean;
  status: StatusFilter;
  tipo: TipoFilter;
  search: string;
  onSelect: (solicitud: Solicitud) => void;
}

export const SolicitudesList: React.FC<SolicitudesListProps> = ({
  solicitudes,
  isLoading,
  status,
  tipo,
  search,
  onSelect,
}) => {
  const filtered = solicitudes
    .filter((s) => status === 'all' || s.estado === status)
    .filter((s) => tipo === 'all' || s.tipo === tipo)
    .filter((s) =>
      search.trim() === ''
        ? true
        : s.solicitanteName.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort(
      (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
    );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
        Cargando solicitudes...
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
        No hay solicitudes que coincidan con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="solicitudes-list">
      {filtered.map((solicitud) => (
        <SolicitudCard key={solicitud.id} solicitud={solicitud} onClick={onSelect} />
      ))}
    </div>
  );
};
