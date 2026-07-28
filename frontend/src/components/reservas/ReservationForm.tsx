import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { Banner } from '../ui/Banner';
import { Espacio } from '../../types/models';

interface ReservationFormProps {
  espacios: Espacio[];
  selectedDate: string | null;
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

interface FormData {
  espacioId: string;
  fechaInicio: string;
  horaInicio: string;
  horaFin: string;
  notas?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  espacios,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onSubmit,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<FormData>({
    espacioId: '',
    fechaInicio: selectedDate || '',
    horaInicio: selectedStartTime || '',
    horaFin: selectedEndTime || '',
    notas: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [localError, setLocalError] = useState<string | null>(null);

  // Update form when selected values change
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fechaInicio: selectedDate || prev.fechaInicio,
      horaInicio: selectedStartTime || prev.horaInicio,
      horaFin: selectedEndTime || prev.horaFin,
    }));
  }, [selectedDate, selectedStartTime, selectedEndTime]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.espacioId) {
      newErrors.espacioId = 'El espacio es requerido';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha es requerida';
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es requerida';
    }

    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es requerida';
    }

    if (formData.horaInicio && formData.horaFin) {
      if (formData.horaInicio >= formData.horaFin) {
        newErrors.horaFin = 'La hora de fin debe ser mayor que la hora de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la reserva';
      setLocalError(errorMessage);
    }
  };

  return (
    <Card>
      <Card.Header variant="navy">
        <h3 className="text-h3 font-600 text-white">Detalles de la Reserva</h3>
      </Card.Header>

      <Card.Body className="p-lg">
        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Error Messages */}
          {(localError || error) && (
            <Banner type="danger">
              <div className="space-y-xs">
                <p className="font-600">Error al procesar tu solicitud</p>
                <p className="text-body-small">{localError || error}</p>
              </div>
            </Banner>
          )}

          {/* Space Selection */}
          <div>
            <label htmlFor="espacioId" className="block text-label text-neutral-700 mb-md">
              Espacio *
            </label>
            <select
              id="espacioId"
              name="espacioId"
              value={formData.espacioId}
              onChange={handleInputChange}
              className={`w-full h-[38px] px-3 border-[0.5px] rounded-btn text-body font-normal transition-all duration-150 ${
                errors.espacioId
                  ? 'border-danger focus:border-danger focus:shadow-focus-danger'
                  : 'border-neutral-300 focus:border-navy-800 focus:shadow-focus-navy'
              } placeholder-neutral-500`}
            >
              <option value="">Selecciona un espacio</option>
              {espacios.map((espacio) => (
                <option key={espacio.id} value={espacio.id}>
                  {espacio.nombre} (Cap. {espacio.capacidad})
                </option>
              ))}
            </select>
            {errors.espacioId && (
              <p className="text-caption text-danger mt-sm">{errors.espacioId}</p>
            )}
          </div>

          {/* Date Selection */}
          <FormInput
            label="Fecha *"
            type="date"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleInputChange}
            error={errors.fechaInicio}
            min={new Date().toISOString().split('T')[0]}
          />

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-md">
            <FormInput
              label="Hora Inicio *"
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleInputChange}
              error={errors.horaInicio}
              min="08:00"
              max="22:00"
            />
            <FormInput
              label="Hora Fin *"
              type="time"
              name="horaFin"
              value={formData.horaFin}
              onChange={handleInputChange}
              error={errors.horaFin}
              min="08:00"
              max="22:00"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Notas (Opcional)
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleInputChange}
              placeholder="Agregue cualquier comentario adicional..."
              rows={4}
              className="w-full px-3 py-md border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy transition-all duration-150 placeholder-neutral-500"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Procesando...' : 'Reservar Espacio'}
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
};
