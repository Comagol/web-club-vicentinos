import React, { useState } from 'react';
import { TeamMember } from '../../hooks/useTeamMembers';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onSubmit: (taskData: {
    titulo: string;
    descripcion: string;
    asignadoA: string;
    prioridad: 'baja' | 'media' | 'alta';
    fechaVencimiento: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  isOpen,
  onClose,
  members,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    asignadoA: members.length > 0 ? members[0].id : '',
    prioridad: 'media' as 'baja' | 'media' | 'alta',
    fechaVencimiento: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    if (!formData.asignadoA) {
      newErrors.asignadoA = 'Debe asignar la tarea a un miembro del equipo';
    }
    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
    } else if (new Date(formData.fechaVencimiento) < new Date()) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento debe ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        titulo: '',
        descripcion: '',
        asignadoA: members.length > 0 ? members[0].id : '',
        prioridad: 'media',
        fechaVencimiento: '',
      });

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error al crear la tarea';
      setSubmitError(errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nueva tarea
          </h2>

          {submitSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              Tarea creada correctamente
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy ${
                  errors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Revisar inventario"
              />
              {errors.titulo && (
                <p className="text-red-600 text-xs mt-1">{errors.titulo}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy ${
                  errors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detalles de la tarea..."
                rows={3}
              />
              {errors.descripcion && (
                <p className="text-red-600 text-xs mt-1">{errors.descripcion}</p>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Asignar a *
              </label>
              <select
                value={formData.asignadoA}
                onChange={(e) =>
                  setFormData({ ...formData, asignadoA: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy ${
                  errors.asignadoA ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.nombre} {member.apellido}
                  </option>
                ))}
              </select>
              {errors.asignadoA && (
                <p className="text-red-600 text-xs mt-1">{errors.asignadoA}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prioridad: e.target.value as 'baja' | 'media' | 'alta',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de vencimiento *
              </label>
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fechaVencimiento: e.target.value,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy ${
                  errors.fechaVencimiento ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaVencimiento && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.fechaVencimiento}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark disabled:opacity-50"
              >
                {isLoading ? 'Creando...' : 'Crear tarea'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
