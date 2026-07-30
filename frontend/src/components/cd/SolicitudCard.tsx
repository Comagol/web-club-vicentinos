import React from 'react';
import { Solicitud } from '../../types/models';

interface SolicitudCardProps {
  solicitud: Solicitud;
  onClick: (solicitud: Solicitud) => void;
}

const tipoLabels: Record<Solicitud['tipo'], string> = {
  reserva: 'Reserva',
  actividad: 'Actividad',
  espacios_subcomision: 'Espacios',
};

const tipoStyles: Record<Solicitud['tipo'], string> = {
  reserva: 'bg-navy-800 text-white',
  actividad: 'bg-gold-500 text-navy-800',
  espacios_subcomision: 'bg-purple-100 text-purple-800',
};

const estadoLabels: Record<Solicitud['estado'], string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

const estadoStyles: Record<Solicitud['estado'], string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  aprobado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
};

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const SolicitudCard: React.FC<SolicitudCardProps> = ({ solicitud, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(solicitud)}
      data-testid={`solicitud-card-${solicitud.id}`}
      className="w-full text-left bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{solicitud.solicitanteName}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDate(solicitud.fechaCreacion)}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tipoStyles[solicitud.tipo]}`}
          >
            {tipoLabels[solicitud.tipo]}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${estadoStyles[solicitud.estado]}`}
          >
            {estadoLabels[solicitud.estado]}
          </span>
        </div>
      </div>
    </button>
  );
};
