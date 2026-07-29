import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Reserva } from '../../types/models';

interface BookingsListProps {
  reservas: Reserva[];
  loading: boolean;
  error?: string | null;
  onCancel: (reservaId: string) => Promise<void>;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  reservas,
  loading,
  error,
  onCancel,
}) => {
  const [canceling, setCanceling] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleCancel = async (reservaId: string) => {
    try {
      setCanceling(reservaId);
      setCancelError(null);
      await onCancel(reservaId);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Error canceling reservation');
    } finally {
      setCanceling(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-500">Error al cargar reservas</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-neutral-100 rounded-lg animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!reservas || reservas.length === 0) {
    return (
      <div className="p-4 text-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-600 font-500">No hay reservas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cancelError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{cancelError}</p>
        </div>
      )}

      {reservas.map((reserva) => (
        <div
          key={reserva.id}
          className="p-4 border-[0.5px] border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="font-500 text-navy-800">
                  {new Date(reserva.fechaInicio).toLocaleDateString('es-AR')}
                </p>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-500">
                  {reserva.horaInicio} - {reserva.horaFin}
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                Miembro: <span className="font-500">{reserva.socioId}</span>
              </p>
              {reserva.notas && (
                <p className="text-sm text-neutral-600">Notas: {reserva.notas}</p>
              )}
              <div className="flex gap-2">
                <span
                  className={`text-xs font-500 px-2 py-1 rounded ${
                    reserva.estado === 'aprobado'
                      ? 'bg-green-100 text-green-700'
                      : reserva.estado === 'rechazado'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCancel(reserva.id)}
              disabled={canceling === reserva.id}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel reservation"
              title="Cancelar reserva"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
