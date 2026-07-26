import React from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  badgeVariant: 'active' | 'inactive' | 'pending' | 'info' | 'gray';
  badgeText: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  status,
  badgeVariant,
  badgeText,
  description,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Card.Body className="p-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy-50 rounded-sm text-navy-800">
              {icon}
            </div>
            <div>
              <h3 className="text-body font-600 text-navy-800">{title}</h3>
              <p className="text-caption text-gray-500">{status}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant}>{badgeText}</Badge>
          {description && (
            <p className="text-caption text-gray-500">{description}</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export const QuickStats: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      icon: <CheckCircle size={24} />,
      title: 'Estado de Membresía',
      status: 'Tu estado actual',
      badgeVariant: 'active' as const,
      badgeText: 'Activo',
      description: 'Desde hace 2 años',
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Estado de Cuotas',
      status: 'Pagos',
      badgeVariant: 'active' as const,
      badgeText: 'Al Día',
      description: 'Próximo pago en Agosto',
    },
    {
      icon: <AlertCircle size={24} />,
      title: 'Carnet de Identidad',
      status: 'Documento',
      badgeVariant: 'active' as const,
      badgeText: 'Habilitado',
      description: 'Válido hasta 2027',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-h2 font-600 text-navy-800 mb-4">Estado General</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
};
