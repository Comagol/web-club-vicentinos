import React from 'react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { DuesStatus } from '../../components/portal/DuesStatus';
import { PaymentHistory } from '../../components/portal/PaymentHistory';

// Mock dues status data
const mockDuesStatus = {
  status: 'al día' as const,
  dueDate: '2026-08-15',
  amount: 150,
  proximoPago: 'Agosto 2026',
};

export const FeesPage: React.FC = () => {
  return (
    <PortalLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-700 text-navy-800 mb-2">
            Cuotas y Membresía
          </h1>
          <p className="text-neutral-600">
            Consulta el estado de tus cuotas y revisa tu historial de pagos
          </p>
        </div>

        {/* Dues Status Section */}
        <DuesStatus
          status={mockDuesStatus.status}
          dueDate={mockDuesStatus.dueDate}
          amount={mockDuesStatus.amount}
          proximoPago={mockDuesStatus.proximoPago}
        />

        {/* Payment History Section */}
        <PaymentHistory />
      </div>
    </PortalLayout>
  );
};
