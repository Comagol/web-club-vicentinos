import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DuesStatusProps {
  status: 'al día' | 'vencida' | 'vencida_hace_meses';
  dueDate: string;
  amount: number;
  proximoPago: string;
}

export const DuesStatus: React.FC<DuesStatusProps> = ({
  status,
  dueDate,
  amount,
  proximoPago,
}) => {
  const getStatusBadgeVariant = (
    status: 'al día' | 'vencida' | 'vencida_hace_meses'
  ): 'active' | 'inactive' | 'pending' => {
    switch (status) {
      case 'al día':
        return 'active';
      case 'vencida':
        return 'inactive';
      case 'vencida_hace_meses':
        return 'inactive';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status: 'al día' | 'vencida' | 'vencida_hace_meses') => {
    switch (status) {
      case 'al día':
        return <CheckCircle size={48} className="text-success-text" />;
      case 'vencida':
        return <AlertCircle size={48} className="text-danger-text" />;
      case 'vencida_hace_meses':
        return <AlertCircle size={48} className="text-danger-text" />;
      default:
        return <Clock size={48} className="text-warning-text" />;
    }
  };

  const getStatusLabel = (status: 'al día' | 'vencida' | 'vencida_hace_meses') => {
    switch (status) {
      case 'al día':
        return 'Al Día';
      case 'vencida':
        return 'Vencida';
      case 'vencida_hace_meses':
        return 'Vencida hace meses';
      default:
        return 'Pendiente';
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  return (
    <Card className="mb-6 border-0 shadow-lg">
      <Card.Body className="p-xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex-shrink-0">{getStatusIcon(status)}</div>
          <div className="flex-1">
            <h2 className="text-h2 font-700 text-navy-800 mb-2">
              Estado de Cuotas
            </h2>
            <Badge variant={getStatusBadgeVariant(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
          {/* Due Date */}
          <div>
            <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
              Fecha de Vencimiento
            </p>
            <p className="text-body font-600 text-navy-800">
              {formatDate(dueDate)}
            </p>
          </div>

          {/* Amount */}
          <div>
            <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
              Monto a Pagar
            </p>
            <p className="text-body font-600 text-navy-800">
              ${amount.toLocaleString('es-AR')}
            </p>
          </div>

          {/* Next Payment */}
          <div>
            <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
              Próximo Pago
            </p>
            <p className="text-body font-600 text-navy-800">
              {proximoPago}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
