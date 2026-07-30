import React, { useState } from 'react';
import { Modal, FormInput, Banner } from '../ui';
import { Socio } from '../../types/models';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Socio, 'id' | 'fechaCreacion'>) => Promise<Socio>;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  email: string;
  nombre: string;
  apellido: string;
  numeroSocio: string;
  rol: Socio['rol'];
  categoria: Socio['categoria'];
  disciplina: Socio['disciplina'];
}

const initialState: FormState = {
  email: '',
  nombre: '',
  apellido: '',
  numeroSocio: '',
  rol: 'socio',
  categoria: 'adulto',
  disciplina: 'rugby',
};

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetAndClose = () => {
    setForm(initialState);
    setErrors({});
    setSubmitError(null);
    setSuccess(false);
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Email inválido';
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!form.numeroSocio.trim()) newErrors.numeroSocio = 'El número de socio es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        email: form.email,
        nombre: form.nombre,
        apellido: form.apellido,
        numeroSocio: form.numeroSocio,
        rol: form.rol,
        categoria: form.categoria,
        disciplina: form.disciplina,
        estadoCuota: 'al_dia',
        estadoMembresia: 'activo',
        habilitadoEstacionamiento: false,
      });
      setSuccess(true);
      setTimeout(() => {
        resetAndClose();
      }, 1200);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Nuevo usuario"
      actions={
        success
          ? undefined
          : [
              { label: 'Cancelar', onClick: resetAndClose, variant: 'ghost' },
              { label: isSubmitting ? 'Creando...' : 'Crear usuario', onClick: handleSubmit },
            ]
      }
    >
      {success ? (
        <Banner type="success">Usuario creado correctamente.</Banner>
      ) : (
        <div className="space-y-4">
          {submitError && <Banner type="danger">{submitError}</Banner>}

          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              error={errors.nombre}
            />
            <FormInput
              label="Apellido"
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              error={errors.apellido}
            />
          </div>
          <FormInput
            label="Número de socio"
            value={form.numeroSocio}
            onChange={(e) => setForm({ ...form, numeroSocio: e.target.value })}
            error={errors.numeroSocio}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-label text-neutral-700 mb-md">Rol</label>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value as Socio['rol'] })}
                className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body"
              >
                <option value="socio">Socio</option>
                <option value="empleado">Empleado</option>
                <option value="jefe_area">Jefe de área</option>
                <option value="subcomision">Subcomisión</option>
                <option value="comision_directiva">Comisión directiva</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-label text-neutral-700 mb-md">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as Socio['categoria'] })}
                className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body"
              >
                <option value="adulto">Adulto</option>
                <option value="joven">Joven</option>
                <option value="junior">Junior</option>
                <option value="pensionista">Pensionista</option>
              </select>
            </div>
            <div>
              <label className="block text-label text-neutral-700 mb-md">Disciplina</label>
              <select
                value={form.disciplina}
                onChange={(e) => setForm({ ...form, disciplina: e.target.value as Socio['disciplina'] })}
                className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body"
              >
                <option value="rugby">Rugby</option>
                <option value="hockey">Hockey</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
