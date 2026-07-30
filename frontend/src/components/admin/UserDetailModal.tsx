import React, { useEffect, useState } from 'react';
import { Modal, FormInput, Banner, Badge } from '../ui';
import { Socio } from '../../types/models';
import { getRoleBadge, getStatusBadge } from './userBadges';

interface UserDetailModalProps {
  isOpen: boolean;
  user: Socio | null;
  onClose: () => void;
  onSave: (userId: string, data: Partial<Socio>) => Promise<Socio>;
  onDelete: (userId: string) => Promise<void>;
}

interface EditableFields {
  nombre: string;
  apellido: string;
  categoria: Socio['categoria'];
  disciplina: Socio['disciplina'];
  estadoMembresia: Socio['estadoMembresia'];
  habilitadoEstacionamiento: boolean;
  rol: Socio['rol'];
}

const toEditableFields = (user: Socio): EditableFields => ({
  nombre: user.nombre,
  apellido: user.apellido,
  categoria: user.categoria,
  disciplina: user.disciplina,
  estadoMembresia: user.estadoMembresia,
  habilitadoEstacionamiento: user.habilitadoEstacionamiento,
  rol: user.rol,
});

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditableFields | null>(user ? toEditableFields(user) : null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm(toEditableFields(user));
      setIsEditing(false);
      setConfirmingDelete(false);
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user || !form) return null;

  const roleBadge = getRoleBadge(user.rol);
  const statusBadge = getStatusBadge(user.estadoMembresia);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await onSave(user.id, form);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(toEditableFields(user));
    setIsEditing(false);
    setError(null);
  };

  const handleDeleteClick = async () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setError(null);
    try {
      await onDelete(user.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    }
  };

  const actions = isEditing
    ? [
        { label: 'Cancelar', onClick: handleCancelEdit, variant: 'ghost' as const },
        { label: isSaving ? 'Guardando...' : 'Guardar', onClick: handleSave },
      ]
    : [
        { label: confirmingDelete ? '¿Confirmar eliminación?' : 'Eliminar', onClick: handleDeleteClick, variant: 'danger' as const },
        { label: 'Editar', onClick: () => setIsEditing(true) },
      ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de usuario" actions={actions}>
      <div className="space-y-4">
        {error && <Banner type="danger">{error}</Banner>}

        {!isEditing ? (
          <>
            <div>
              <p className="text-body font-semibold text-neutral-900">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-body-sm text-neutral-500">{user.email}</p>
              <p className="text-body-sm text-neutral-500">N° socio: {user.numeroSocio}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
              <Badge variant={user.disciplina === 'rugby' ? 'rugby' : 'hockey'}>
                {user.disciplina === 'rugby' ? 'Rugby' : 'Hockey'}
              </Badge>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-body-sm">
              <div>
                <dt className="text-neutral-500">Categoría</dt>
                <dd className="text-neutral-900 capitalize">{user.categoria}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Estado de cuota</dt>
                <dd className="text-neutral-900 capitalize">{user.estadoCuota.replace(/_/g, ' ')}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Estacionamiento</dt>
                <dd className="text-neutral-900">
                  {user.habilitadoEstacionamiento ? 'Habilitado' : 'No habilitado'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Creado</dt>
                <dd className="text-neutral-900">
                  {new Date(user.fechaCreacion).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <FormInput
                label="Apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-label text-neutral-700 mb-md">Estado de membresía</label>
                <select
                  value={form.estadoMembresia}
                  onChange={(e) =>
                    setForm({ ...form, estadoMembresia: e.target.value as Socio['estadoMembresia'] })
                  }
                  className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body"
                >
                  <option value="activo">Activo</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <label className="flex items-center gap-2 text-body-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.habilitadoEstacionamiento}
                onChange={(e) => setForm({ ...form, habilitadoEstacionamiento: e.target.checked })}
              />
              Habilitado para estacionamiento
            </label>
          </>
        )}
      </div>
    </Modal>
  );
};
