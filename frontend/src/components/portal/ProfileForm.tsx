import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { Banner } from '../ui/Banner';

export interface ProfileData {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  categoria: 'adulto' | 'joven' | 'junior' | 'pensionista';
  disciplina: 'rugby' | 'hockey';
  numeroSocio: string;
  avatar: string | null;
  fechaAlta: string;
}

interface ProfileFormProps {
  profileData: ProfileData;
  onSave?: (updatedData: ProfileData) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  onSave,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileData>(profileData);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      telefono: e.target.value,
    });
  };

  const handleCancel = () => {
    // Discard changes and return to view mode
    setFormData(profileData);
    setIsEditMode(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (onSave) {
        await onSave(formData);
      }
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditMode(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al guardar el perfil';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    adulto: 'Adulto',
    joven: 'Joven',
    junior: 'Junior',
    pensionista: 'Pensionista',
  };

  const disciplineLabels: Record<string, string> = {
    rugby: 'Rugby',
    hockey: 'Hockey',
  };

  const displayName = formData.nombre || formData.email?.split('@')[0] || 'Miembro';

  return (
    <div className="space-y-4">
      {/* Success Banner */}
      {successMessage && (
        <Banner
          type="success"
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Banner>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <Banner
          type="danger"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Banner>
      )}

      {/* Profile Card */}
      <Card>
        {/* Header with Edit Button */}
        <Card.Header className="flex items-center justify-between">
          <h2 className="text-xl font-700 text-navy-800">Mi Información</h2>
          {!isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(true)}
            >
              Editar
            </Button>
          )}
        </Card.Header>

        {/* Body with Form Fields */}
        <Card.Body className="space-y-6">
          {/* Name Field (Read-only) */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Nombre
            </label>
            <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
              {displayName}
            </div>
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Email
            </label>
            <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
              {formData.email}
            </div>
          </div>

          {/* Phone Field (Editable in edit mode) */}
          {isEditMode ? (
            <FormInput
              label="Teléfono"
              type="tel"
              value={formData.telefono || ''}
              onChange={handlePhoneChange}
              placeholder="+54 9 11 1234-5678"
            />
          ) : (
            <div>
              <label className="block text-label text-neutral-700 mb-md">
                Teléfono
              </label>
              <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
                {formData.telefono || 'No especificado'}
              </div>
            </div>
          )}

          {/* Category Field (Read-only) */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Categoría
            </label>
            <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
              {categoryLabels[formData.categoria] || formData.categoria}
            </div>
          </div>

          {/* Discipline Field (Read-only) */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Disciplina
            </label>
            <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
              {disciplineLabels[formData.disciplina] || formData.disciplina}
            </div>
          </div>

          {/* Member Number Field (Read-only) */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Número de Socio
            </label>
            <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
              {formData.numeroSocio}
            </div>
          </div>

          {/* Member Since Field (Read-only) */}
          <div>
            <label className="block text-label text-neutral-700 mb-md">
              Miembro Desde
            </label>
            <div className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal bg-neutral-50 flex items-center text-neutral-600">
              {new Date(formData.fechaAlta).toLocaleDateString('es-AR')}
            </div>
          </div>
        </Card.Body>

        {/* Footer with Action Buttons */}
        {isEditMode && (
          <Card.Footer className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              size="md"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};
