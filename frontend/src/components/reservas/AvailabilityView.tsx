import React from 'react';
import { Card } from '../ui/Card';
import { Banner } from '../ui/Banner';

interface AvailabilityViewProps {
  espacioId: string | null;
  fecha: string | null;
  disponibilidad: any;
  loading: boolean;
  onTimeSelect: (startTime: string, endTime: string) => void;
  selectedStartTime: string | null;
}

export const AvailabilityView: React.FC<AvailabilityViewProps> = ({
  espacioId,
  fecha,
  disponibilidad,
  loading,
  onTimeSelect,
  selectedStartTime,
}) => {
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00',
  ];

  const getAvailableSlots = (): string[] => {
    if (!disponibilidad) return [];

    if (Array.isArray(disponibilidad)) {
      return disponibilidad;
    }

    if (disponibilidad.available && Array.isArray(disponibilidad.available)) {
      return disponibilidad.available;
    }

    return [];
  };

  const availableSlots = getAvailableSlots();

  if (!espacioId || !fecha) {
    return (
      <Card>
        <Card.Header variant="navy">
          <h3 className="text-h3 font-600 text-white">Horarios Disponibles</h3>
        </Card.Header>
        <Card.Body className="p-lg">
          <Banner type="info">
            <p className="text-body-small">Selecciona un espacio y una fecha para ver horarios disponibles</p>
          </Banner>
        </Card.Body>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <Card.Header variant="navy">
          <h3 className="text-h3 font-600 text-white">Horarios Disponibles</h3>
        </Card.Header>
        <Card.Body className="p-lg">
          <div className="flex items-center justify-center py-12">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-800 rounded-full animate-spin"></div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header variant="navy">
        <h3 className="text-h3 font-600 text-white">Horarios Disponibles</h3>
      </Card.Header>

      <Card.Body className="p-lg">
        {availableSlots.length === 0 ? (
          <Banner type="warning">
            <p className="text-body-small">No hay horarios disponibles para la fecha y espacio seleccionados</p>
          </Banner>
        ) : (
          <div className="space-y-md">
            <p className="text-label text-neutral-600">
              {availableSlots.length} horarios disponibles
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-xs">
              {timeSlots.map((time) => {
                const isAvailable = availableSlots.includes(time);
                const isSelected = selectedStartTime === time;

                return (
                  <button
                    key={time}
                    onClick={() => {
                      if (isAvailable) {
                        // Calculate end time as 30 minutes after start
                        const [hours, minutes] = time.split(':').map(Number);
                        const endMinutes = minutes + 30;
                        const endHours = Math.floor((hours * 60 + endMinutes) / 60);
                        const endMins = (hours * 60 + endMinutes) % 60;
                        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

                        onTimeSelect(time, endTime);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`
                      py-md px-xs rounded-md text-label font-500
                      transition-all duration-150 text-center
                      ${
                        isSelected
                          ? 'bg-gold-500 text-navy-800 font-600'
                          : isAvailable
                            ? 'bg-navy-50 text-navy-800 hover:bg-navy-100 border border-navy-200'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-200'
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
