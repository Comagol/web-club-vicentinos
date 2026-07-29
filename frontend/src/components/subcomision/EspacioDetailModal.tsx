import React from 'react';
import { X, Users, BookOpen } from 'lucide-react';
import { Espacio, Reserva } from '../../types/models';
import { BookingsList } from './BookingsList';

interface EspacioDetailModalProps {
  espacio: Espacio | null;
  bookings: Reserva[];
  bookingsLoading: boolean;
  bookingsError?: string | null;
  onClose: () => void;
  onCancel: (reservaId: string) => Promise<void>;
}

export const EspacioDetailModal: React.FC<EspacioDetailModalProps> = ({
  espacio,
  bookings,
  bookingsLoading,
  bookingsError,
  onClose,
  onCancel,
}) => {
  if (!espacio) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
          <h2 className="text-h2 font-700 text-navy-800">{espacio.nombre}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded"
            aria-label="Close"
          >
            <X size={24} className="text-neutral-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 uppercase tracking-wider">Capacidad</p>
              <div className="flex items-center gap-2 mt-2">
                <Users size={20} className="text-navy-800" />
                <p className="text-lg font-600 text-navy-800">{espacio.capacidad} personas</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 uppercase tracking-wider">Estado</p>
              <div className="mt-2">
                {espacio.activo ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-500">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full font-500">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Inactivo
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-label font-600 text-navy-800">Descripción</h3>
            <p className="text-body text-neutral-700">
              {espacio.descripcion || 'Sin descripción disponible'}
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-navy-800" />
              <h3 className="text-label font-600 text-navy-800">Reservas próximas</h3>
            </div>

            <BookingsList
              reservas={bookings}
              loading={bookingsLoading}
              error={bookingsError}
              onCancel={onCancel}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-neutral-300 rounded-lg font-500 text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
