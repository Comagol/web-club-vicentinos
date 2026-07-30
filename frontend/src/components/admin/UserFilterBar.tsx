import React, { useState } from 'react';
import { Button, FormInput } from '../ui';
import { Socio } from '../../types/models';

export type RoleFilterValue = Socio['rol'] | 'all';
export type StatusFilterValue = Socio['estadoMembresia'] | 'all';

interface UserFilterBarProps {
  role: RoleFilterValue;
  status: StatusFilterValue;
  search: string;
  onApply: (filters: { role: RoleFilterValue; status: StatusFilterValue; search: string }) => void;
  onClear: () => void;
}

const roleOptions: { value: RoleFilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'socio', label: 'Socio' },
  { value: 'empleado', label: 'Empleado' },
  { value: 'jefe_area', label: 'Jefe de área' },
  { value: 'subcomision', label: 'Subcomisión' },
  { value: 'comision_directiva', label: 'Comisión directiva' },
  { value: 'admin', label: 'Admin' },
];

const statusOptions: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'activo', label: 'Activo' },
  { value: 'suspendido', label: 'Suspendido' },
  { value: 'inactivo', label: 'Inactivo' },
];

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  role,
  status,
  search,
  onApply,
  onClear,
}) => {
  const [localRole, setLocalRole] = useState<RoleFilterValue>(role);
  const [localStatus, setLocalStatus] = useState<StatusFilterValue>(status);
  const [localSearch, setLocalSearch] = useState(search);

  const handleApply = () => {
    onApply({ role: localRole, status: localStatus, search: localSearch });
  };

  const handleClear = () => {
    setLocalRole('all');
    setLocalStatus('all');
    setLocalSearch('');
    onClear();
  };

  return (
    <div className="bg-white border-[0.5px] border-neutral-300 rounded-card p-lg mb-6 flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <FormInput
          label="Buscar"
          placeholder="Nombre o email"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <div className="min-w-[180px]">
        <label className="block text-label text-neutral-700 mb-md">Rol</label>
        <select
          value={localRole}
          onChange={(e) => setLocalRole(e.target.value as RoleFilterValue)}
          className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body focus:border-navy-800"
        >
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[160px]">
        <label className="block text-label text-neutral-700 mb-md">Estado</label>
        <select
          value={localStatus}
          onChange={(e) => setLocalStatus(e.target.value as StatusFilterValue)}
          className="w-full h-[38px] px-3 border-[0.5px] border-neutral-300 rounded-btn text-body focus:border-navy-800"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button variant="primary" onClick={handleApply}>
          Aplicar
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          Limpiar
        </Button>
      </div>
    </div>
  );
};
