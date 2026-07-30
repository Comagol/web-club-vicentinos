import React, { useMemo, useState } from 'react';
import { Badge, Button } from '../ui';
import { Socio } from '../../types/models';
import { getRoleBadge, getStatusBadge } from './userBadges';

export type SortField = 'nombre' | 'rol' | 'fechaCreacion';

interface UsersListProps {
  users: Socio[];
  isLoading: boolean;
  onEdit: (user: Socio) => void;
  onDelete: (user: Socio) => void;
}

export const UsersList: React.FC<UsersListProps> = ({ users, isLoading, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortAsc, setSortAsc] = useState(true);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const sortedUsers = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'nombre') {
        cmp = `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`);
      } else if (sortField === 'rol') {
        cmp = a.rol.localeCompare(b.rol);
      } else if (sortField === 'fechaCreacion') {
        cmp = new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
      }
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [users, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleDeleteClick = (user: Socio) => {
    if (confirmingDeleteId === user.id) {
      setConfirmingDeleteId(null);
      onDelete(user);
    } else {
      setConfirmingDeleteId(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border-[0.5px] border-neutral-300 rounded-card p-lg" data-testid="users-list-loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse mb-3" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white border-[0.5px] border-neutral-300 rounded-card p-lg text-center py-12">
        <p className="text-neutral-500">No se encontraron usuarios.</p>
      </div>
    );
  }

  const sortIndicator = (field: SortField) => (field === sortField ? (sortAsc ? ' ▲' : ' ▼') : '');

  return (
    <div className="bg-white border-[0.5px] border-neutral-300 rounded-card overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-[0.5px] border-neutral-300">
            <th
              className="px-lg py-md text-label text-neutral-500 cursor-pointer select-none"
              onClick={() => handleSort('nombre')}
            >
              Nombre{sortIndicator('nombre')}
            </th>
            <th className="px-lg py-md text-label text-neutral-500">Email</th>
            <th
              className="px-lg py-md text-label text-neutral-500 cursor-pointer select-none"
              onClick={() => handleSort('rol')}
            >
              Rol{sortIndicator('rol')}
            </th>
            <th className="px-lg py-md text-label text-neutral-500">Estado</th>
            <th
              className="px-lg py-md text-label text-neutral-500 cursor-pointer select-none"
              onClick={() => handleSort('fechaCreacion')}
            >
              Creado{sortIndicator('fechaCreacion')}
            </th>
            <th className="px-lg py-md text-label text-neutral-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => {
            const roleBadge = getRoleBadge(user.rol);
            const statusBadge = getStatusBadge(user.estadoMembresia);
            const isConfirming = confirmingDeleteId === user.id;

            return (
              <tr key={user.id} className="border-b-[0.5px] border-neutral-300 last:border-b-0">
                <td className="px-lg py-md text-body text-neutral-900">
                  {user.nombre} {user.apellido}
                </td>
                <td className="px-lg py-md text-body-sm text-neutral-500">{user.email}</td>
                <td className="px-lg py-md">
                  <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                </td>
                <td className="px-lg py-md">
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </td>
                <td className="px-lg py-md text-body-sm text-neutral-500">
                  {new Date(user.fechaCreacion).toLocaleDateString()}
                </td>
                <td className="px-lg py-md">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      {isConfirming ? '¿Confirmar?' : 'Eliminar'}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
