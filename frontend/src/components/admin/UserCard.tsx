import React from 'react';
import { Card, Badge, Button } from '../ui';
import { Socio } from '../../types/models';
import { getRoleBadge, getStatusBadge } from './userBadges';

interface UserCardProps {
  user: Socio;
  onViewDetails: (user: Socio) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onViewDetails }) => {
  const roleBadge = getRoleBadge(user.rol);
  const statusBadge = getStatusBadge(user.estadoMembresia);

  return (
    <Card data-testid={`user-card-${user.id}`}>
      <Card.Body>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-body font-semibold text-neutral-900">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-body-sm text-neutral-500">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>

        <Button variant="outline" size="sm" onClick={() => onViewDetails(user)}>
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};
