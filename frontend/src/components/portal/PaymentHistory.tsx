import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: 'bank_transfer' | 'cash' | 'card';
  concepto?: string;
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

const mockPayments: Payment[] = [
  {
    id: 'pago-001',
    date: '2026-07-15',
    amount: 150,
    status: 'completed',
    method: 'bank_transfer',
    concepto: 'Cuota Mensual',
  },
  {
    id: 'pago-002',
    date: '2026-06-15',
    amount: 150,
    status: 'completed',
    method: 'bank_transfer',
    concepto: 'Cuota Mensual',
  },
  {
    id: 'pago-003',
    date: '2026-05-20',
    amount: 150,
    status: 'completed',
    method: 'cash',
    concepto: 'Cuota Mensual',
  },
  {
    id: 'pago-004',
    date: '2026-04-15',
    amount: 150,
    status: 'completed',
    method: 'bank_transfer',
    concepto: 'Cuota Mensual',
  },
  {
    id: 'pago-005',
    date: '2026-03-15',
    amount: 150,
    status: 'completed',
    method: 'card',
    concepto: 'Cuota Mensual',
  },
];

const getStatusBadgeVariant = (
  status: 'completed' | 'pending' | 'failed'
): 'active' | 'pending' | 'inactive' => {
  switch (status) {
    case 'completed':
      return 'active';
    case 'pending':
      return 'pending';
    case 'failed':
      return 'inactive';
    default:
      return 'pending';
  }
};

const getStatusLabel = (status: 'completed' | 'pending' | 'failed') => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'pending':
      return 'Pendiente';
    case 'failed':
      return 'Rechazado';
    default:
      return 'Desconocido';
  }
};

const getStatusIcon = (status: 'completed' | 'pending' | 'failed') => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={20} className="text-success-text" />;
    case 'pending':
      return <Clock size={20} className="text-warning-text" />;
    case 'failed':
      return <AlertCircle size={20} className="text-danger-text" />;
    default:
      return <Clock size={20} />;
  }
};

const getMethodLabel = (method: 'bank_transfer' | 'cash' | 'card') => {
  switch (method) {
    case 'bank_transfer':
      return 'Transferencia';
    case 'cash':
      return 'Efectivo';
    case 'card':
      return 'Tarjeta';
    default:
      return 'Otro';
  }
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Desktop Table Row Component
const DesktopTableRow: React.FC<{ payment: Payment }> = ({ payment }) => {
  return (
    <tr className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
      <td className="px-lg py-md text-body text-navy-800">
        {formatDate(payment.date)}
      </td>
      <td className="px-lg py-md text-body text-navy-800">
        {payment.concepto || '—'}
      </td>
      <td className="px-lg py-md text-body font-600 text-navy-800">
        ${payment.amount.toLocaleString('es-AR')}
      </td>
      <td className="px-lg py-md">
        <Badge variant={getStatusBadgeVariant(payment.status)}>
          {getStatusLabel(payment.status)}
        </Badge>
      </td>
      <td className="px-lg py-md text-body text-neutral-600">
        {getMethodLabel(payment.method)}
      </td>
    </tr>
  );
};

// Mobile Card Component
const MobilePaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
  return (
    <div className="p-lg border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
            Fecha
          </p>
          <p className="text-body font-600 text-navy-800">
            {formatDate(payment.date)}
          </p>
        </div>
        <div className="flex gap-1">
          {getStatusIcon(payment.status)}
          <Badge variant={getStatusBadgeVariant(payment.status)}>
            {getStatusLabel(payment.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
            Monto
          </p>
          <p className="text-body font-600 text-navy-800">
            ${payment.amount.toLocaleString('es-AR')}
          </p>
        </div>
        <div>
          <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
            Método
          </p>
          <p className="text-body font-600 text-navy-800">
            {getMethodLabel(payment.method)}
          </p>
        </div>
      </div>

      {payment.concepto && (
        <div>
          <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
            Concepto
          </p>
          <p className="text-body text-navy-800">{payment.concepto}</p>
        </div>
      )}
    </div>
  );
};

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments = mockPayments,
}) => {
  return (
    <div>
      <h2 className="text-h2 font-600 text-navy-800 mb-4">Historial de Pagos</h2>

      <Card>
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-50 border-b-2 border-navy-200">
                <th className="px-lg py-md text-left text-caption font-600 text-navy-800 uppercase">
                  Fecha
                </th>
                <th className="px-lg py-md text-left text-caption font-600 text-navy-800 uppercase">
                  Concepto
                </th>
                <th className="px-lg py-md text-left text-caption font-600 text-navy-800 uppercase">
                  Monto
                </th>
                <th className="px-lg py-md text-left text-caption font-600 text-navy-800 uppercase">
                  Estado
                </th>
                <th className="px-lg py-md text-left text-caption font-600 text-navy-800 uppercase">
                  Método
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <DesktopTableRow key={payment.id} payment={payment} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="md:hidden">
          {payments.map((payment) => (
            <MobilePaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      </Card>

      {payments.length === 0 && (
        <div className="text-center py-8 text-neutral-600">
          <p>No hay registros de pagos aún</p>
        </div>
      )}
    </div>
  );
};
