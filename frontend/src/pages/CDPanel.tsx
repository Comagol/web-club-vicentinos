import React, { useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useSolicitudes } from '../hooks/useSolicitudes';
import { Solicitud } from '../types/models';
import { Navbar } from '../components/Navbar';
import {
  RequestFilterBar,
  StatusFilter,
  TipoFilter,
} from '../components/cd/RequestFilterBar';
import { SolicitudesList } from '../components/cd/SolicitudesList';
import { RequestDetailModal } from '../components/cd/RequestDetailModal';

type SidebarSection = 'solicitudes' | 'reportes' | 'configuracion';

export const CDPanel: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const { solicitudes, stats, isLoading, error, refresh, updateSolicitudLocal } =
    useSolicitudes();

  const [activeSection, setActiveSection] = useState<SidebarSection>('solicitudes');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [tipo, setTipo] = useState<TipoFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Solicitud | null>(null);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  const handleApply = (filters: { status: StatusFilter; tipo: TipoFilter; search: string }) => {
    setStatus(filters.status);
    setTipo(filters.tipo);
    setSearch(filters.search);
  };

  const handleClear = () => {
    setStatus('all');
    setTipo('all');
    setSearch('');
  };

  const handleUpdated = (updated: Solicitud) => {
    updateSolicitudLocal(updated);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-navy-800 mb-8">
              Comisión Directiva
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('solicitudes')}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold ${
                  activeSection === 'solicitudes'
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Solicitudes
              </button>
              <button
                onClick={() => setActiveSection('reportes')}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold ${
                  activeSection === 'reportes'
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Reportes
              </button>
              <button
                onClick={() => setActiveSection('configuracion')}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold ${
                  activeSection === 'configuracion'
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Configuración
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {activeSection === 'solicitudes' && 'Solicitudes'}
                {activeSection === 'reportes' && 'Reportes'}
                {activeSection === 'configuracion' && 'Configuración'}
              </h2>
              <p className="text-gray-600 mt-1">
                Panel de gestión de la Comisión Directiva
              </p>
            </div>

            {activeSection === 'solicitudes' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-600 text-sm mb-1">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.pendientes}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-600 text-sm mb-1">Aprobadas hoy</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.aprobadasHoy}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-600 text-sm mb-1">Rechazadas hoy</p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.rechazadasHoy}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                    Error al cargar solicitudes: {error}
                  </div>
                )}

                <RequestFilterBar
                  status={status}
                  tipo={tipo}
                  search={search}
                  onApply={handleApply}
                  onClear={handleClear}
                />

                <SolicitudesList
                  solicitudes={solicitudes}
                  isLoading={isLoading}
                  status={status}
                  tipo={tipo}
                  search={search}
                  onSelect={setSelected}
                />
              </>
            )}

            {activeSection === 'reportes' && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                Próximamente.
              </div>
            )}

            {activeSection === 'configuracion' && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                Próximamente.
              </div>
            )}
          </div>
        </main>
      </div>

      <RequestDetailModal
        solicitud={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
};
