import React from 'react';
import { Card } from '../ui';
import { SystemStats as SystemStatsData } from '../../hooks/useSystemStats';

interface SystemStatsProps {
  stats: SystemStatsData;
  isLoading: boolean;
}

interface StatCardConfig {
  label: string;
  value: number;
  valueClassName: string;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ stats, isLoading }) => {
  const cards: StatCardConfig[] = [
    { label: 'Total usuarios', value: stats.totalUsuarios, valueClassName: 'text-neutral-900' },
    { label: 'Miembros activos', value: stats.activos, valueClassName: 'text-success-text' },
    { label: 'Empleados', value: stats.empleados, valueClassName: 'text-info-text' },
    { label: 'Administradores', value: stats.admins, valueClassName: 'text-danger-text' },
    { label: 'Suspendidos', value: stats.suspendidos, valueClassName: 'text-warning-text' },
    { label: 'Cuota vencida', value: stats.cuotaVencida, valueClassName: 'text-danger-text' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8" data-testid="system-stats-loading">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <Card.Body>
              <div className="h-3 w-20 bg-neutral-200 rounded mb-3" />
              <div className="h-8 w-12 bg-neutral-200 rounded" />
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card) => (
        <Card key={card.label}>
          <Card.Body>
            <p className="text-neutral-500 text-body-sm mb-1">{card.label}</p>
            <p className={`text-h2 font-bold ${card.valueClassName}`}>{card.value}</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};
