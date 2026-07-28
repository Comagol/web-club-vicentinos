import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { ReservationCalendar } from '../../components/reservas/ReservationCalendar';
import { AvailabilityView } from '../../components/reservas/AvailabilityView';
import { ReservationForm } from '../../components/reservas/ReservationForm';
import { Banner } from '../../components/ui/Banner';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useReservations } from '../../hooks/useReservations';
import { Reserva } from '../../types/models';

export const ReservasPage: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const navigate = useNavigate();
  const {
    espacios,
    disponibilidad,
    loading,
    error,
    getDisponibilidad,
    crearReserva,
    clearError,
  } = useReservations();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEspacioId, setSelectedEspacioId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (authLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </PortalLayout>
    );
  }

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    // Fetch availability when date changes
    if (selectedEspacioId) {
      getDisponibilidad(selectedEspacioId, date);
    }
  }, [selectedEspacioId, getDisponibilidad]);

  const handleEspacioChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const espacioId = e.target.value;
    setSelectedEspacioId(espacioId);
    // Fetch availability when espacio changes
    if (selectedDate) {
      getDisponibilidad(espacioId, selectedDate);
    }
  }, [selectedDate, getDisponibilidad]);

  const handleTimeSelect = useCallback((startTime: string, endTime: string) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  }, []);

  const handleSubmit = useCallback(async (formData: any) => {
    try {
      clearError();
      const reservaData: Omit<Reserva, 'id' | 'socioId' | 'createdAt'> = {
        espacioId: formData.espacioId,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaInicio, // Same day reservation
        estado: 'pendiente',
      };

      await crearReserva(reservaData);
      setSuccessMessage('Reserva creada exitosamente');

      // Reset form
      setSelectedDate(null);
      setSelectedEspacioId(null);
      setSelectedStartTime(null);
      setSelectedEndTime(null);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/portal/reservas');
      }, 2000);
    } catch (err) {
      // Error is handled by the hook
      console.error('Reservation error:', err);
    }
  }, [crearReserva, navigate, clearError]);

  return (
    <PortalLayout>
      <div className="max-w-6xl mx-auto space-y-lg">
        {/* Page Title */}
        <div>
          <h1 className="text-h1 font-700 text-navy-800 mb-xs">Reservar Espacios</h1>
          <p className="text-body text-neutral-600">
            Reserva nuestros espacios disponibles para tus actividades
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Banner type="success">
            <div className="space-y-xs">
              <p className="font-600">Éxito</p>
              <p className="text-body-small">{successMessage}</p>
            </div>
          </Banner>
        )}

        {/* Error Message */}
        {error && (
          <Banner type="danger">
            <div className="space-y-xs">
              <p className="font-600">Error al cargar datos</p>
              <p className="text-body-small">{error}</p>
            </div>
          </Banner>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Left Column - Calendar and Availability */}
          <div className="space-y-lg">
            {/* Space Selection - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block">
              <div className="space-y-md">
                <label className="block text-label text-neutral-700">
                  Selecciona un espacio
                </label>
                <select
                  value={selectedEspacioId || ''}
                  onChange={handleEspacioChange}
                  className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy placeholder-neutral-500"
                >
                  <option value="">Selecciona un espacio</option>
                  {espacios.map((espacio) => (
                    <option key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar */}
            <ReservationCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              minDate={new Date().toISOString().split('T')[0]}
            />

            {/* Availability View */}
            <AvailabilityView
              espacioId={selectedEspacioId}
              fecha={selectedDate}
              disponibilidad={disponibilidad}
              loading={loading}
              onTimeSelect={handleTimeSelect}
              selectedStartTime={selectedStartTime}
            />
          </div>

          {/* Right Column - Form */}
          <div>
            {/* Space Selection - Shown on mobile, hidden on desktop */}
            <div className="md:hidden mb-lg">
              <div className="space-y-md bg-white p-lg rounded-card border-[0.5px] border-neutral-300">
                <label className="block text-label text-neutral-700">
                  Selecciona un espacio
                </label>
                <select
                  value={selectedEspacioId || ''}
                  onChange={handleEspacioChange}
                  className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy placeholder-neutral-500"
                >
                  <option value="">Selecciona un espacio</option>
                  {espacios.map((espacio) => (
                    <option key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ReservationForm
              espacios={espacios}
              selectedDate={selectedDate}
              selectedStartTime={selectedStartTime}
              selectedEndTime={selectedEndTime}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};
