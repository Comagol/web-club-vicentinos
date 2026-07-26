import React from 'react';
import { PortalLayout } from '../../components/portal/PortalLayout';

export const PortalDashboard: React.FC = () => {
  return (
    <PortalLayout>
      <div className="max-w-6xl">
        <h1 className="text-3xl font-700 text-navy-800 mb-2">Portal Vicentinos</h1>
        <p className="text-gray-600">Bienvenido a tu portal de miembro</p>
      </div>
    </PortalLayout>
  );
};
