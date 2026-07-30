import React from 'react';
import { Card, Badge } from '../ui';
import { ActivityEntry } from '../../hooks/useAdminUsers';

interface ActivityLogProps {
  entries: ActivityEntry[];
}

const actionLabels: Record<ActivityEntry['accion'], string> = {
  creado: 'creó',
  actualizado: 'actualizó',
  eliminado: 'eliminó',
};

const actionVariants: Record<ActivityEntry['accion'], 'active' | 'inactive' | 'pending' | 'info' | 'gray'> = {
  creado: 'active',
  actualizado: 'info',
  eliminado: 'inactive',
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ entries }) => {
  return (
    <Card>
      <Card.Header>
        <h3 className="text-body font-semibold text-neutral-900">Actividad reciente</h3>
      </Card.Header>
      <Card.Body>
        {entries.length === 0 ? (
          <p className="text-body-sm text-neutral-500">Sin actividad reciente.</p>
        ) : (
          <ul className="space-y-3">
            {entries.slice(0, 20).map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 text-body-sm">
                <div>
                  <Badge variant={actionVariants[entry.accion]}>{actionLabels[entry.accion]}</Badge>
                  <span className="ml-2 text-neutral-900">{entry.usuarioNombre}</span>
                  <p className="text-caption text-neutral-500">
                    por {entry.adminEmail} · {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};
