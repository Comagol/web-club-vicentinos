import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubcomisionEspacios } from '../hooks/useSubcomisionEspacios';
import { useSubcomisionTareas } from '../hooks/useSubcomisionTareas';
import { useSubcomisionBookings } from '../hooks/useSubcomisionBookings';
import { SubcomisionSidebar } from '../components/subcomision/SubcomisionSidebar';
import { PortalBottomNav } from '../components/portal/PortalBottomNav';
import { EspaciosList } from '../components/subcomision/EspaciosList';
import { EspacioDetailModal } from '../components/subcomision/EspacioDetailModal';
import { TasksList } from '../components/subcomision/TasksList';
import { Banner } from '../components/ui/Banner';
import { Espacio, Tarea } from '../types/models';
import { BarChart3, Building2, CheckSquare } from 'lucide-react';

type TabType = 'espacios' | 'tareas' | 'reportes' | 'config';

export const SubcomisionPortal: React.FC = () => {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('espacios');
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null);
  const [taskFilterStatus, setTaskFilterStatus] = useState<'all' | Tarea['estado']>('all');

  // Fetch data
  const {
    espacios,
    loading: espaciosLoading,
    error: espaciosError,
    refetch: refetchEspacios,
  } = useSubcomisionEspacios();

  const {
    tareas,
    loading: tareasLoading,
    error: tareasError,
    refetch: refetchTareas,
    updateTaskStatus,
  } = useSubcomisionTareas();

  const {
    reservas,
    loading: bookingsLoading,
    error: bookingsError,
    cancelReservation,
  } = useSubcomisionBookings(selectedEspacio?.id);

  // Check authorization
  useEffect(() => {
    if (usuario && !usuario.roles.includes('subcomision') && !usuario.roles.includes('admin')) {
      // Redirect unauthorized users
      window.location.href = '/dashboard';
    }
  }, [usuario]);

  if (!usuario || (!usuario.roles.includes('subcomision') && !usuario.roles.includes('admin'))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-600">Acceso no autorizado</p>
      </div>
    );
  }

  // Stats
  const totalSpaces = espacios.length;
  const activeBookings = reservas.length;
  const pendingTasks = tareas.filter((t: Tarea) => t.estado === 'pendiente').length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <SubcomisionSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto pb-20 md:pb-0">
        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-h1 font-700 text-navy-800">Portal de Subcomisión</h1>
            <p className="text-body text-neutral-600 mt-1">
              Gestiona espacios, tareas y reservas del club
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border-[0.5px] border-neutral-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider">Espacios</p>
                  <p className="text-2xl font-700 text-navy-800 mt-2">{totalSpaces}</p>
                </div>
                <Building2 size={32} className="text-gold-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border-[0.5px] border-neutral-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider">
                    Reservas Activas
                  </p>
                  <p className="text-2xl font-700 text-navy-800 mt-2">{activeBookings}</p>
                </div>
                <CheckSquare size={32} className="text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border-[0.5px] border-neutral-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider">
                    Tareas Pendientes
                  </p>
                  <p className="text-2xl font-700 text-navy-800 mt-2">{pendingTasks}</p>
                </div>
                <BarChart3 size={32} className="text-yellow-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('espacios')}
              className={`px-4 py-3 font-500 border-b-2 transition-colors ${
                activeTab === 'espacios'
                  ? 'text-navy-800 border-navy-800'
                  : 'text-neutral-600 border-transparent hover:text-navy-800'
              }`}
            >
              Espacios
            </button>
            <button
              onClick={() => setActiveTab('tareas')}
              className={`px-4 py-3 font-500 border-b-2 transition-colors ${
                activeTab === 'tareas'
                  ? 'text-navy-800 border-navy-800'
                  : 'text-neutral-600 border-transparent hover:text-navy-800'
              }`}
            >
              Tareas
            </button>
            <button
              onClick={() => setActiveTab('reportes')}
              className={`px-4 py-3 font-500 border-b-2 transition-colors ${
                activeTab === 'reportes'
                  ? 'text-navy-800 border-navy-800'
                  : 'text-neutral-600 border-transparent hover:text-navy-800'
              }`}
              disabled
            >
              Reportes (Próx.)
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Espacios Tab */}
            {activeTab === 'espacios' && (
              <div className="space-y-4">
                {espaciosError && (
                  <Banner type="danger">
                    <div>
                      <p className="font-600">Error al cargar espacios</p>
                      <p className="text-sm mt-1">{espaciosError}</p>
                      <button
                        onClick={refetchEspacios}
                        className="text-sm underline mt-2 hover:no-underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  </Banner>
                )}
                <EspaciosList
                  espacios={espacios}
                  loading={espaciosLoading}
                  error={espaciosError}
                  onSelectEspacio={setSelectedEspacio}
                />
              </div>
            )}

            {/* Tareas Tab */}
            {activeTab === 'tareas' && (
              <div className="space-y-4">
                {tareasError && (
                  <Banner type="danger">
                    <div>
                      <p className="font-600">Error al cargar tareas</p>
                      <p className="text-sm mt-1">{tareasError}</p>
                      <button
                        onClick={refetchTareas}
                        className="text-sm underline mt-2 hover:no-underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  </Banner>
                )}

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'pendiente', 'en_progreso', 'completado'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setTaskFilterStatus(status as 'all' | Tarea['estado'])
                      }
                      className={`px-4 py-2 rounded-full text-sm font-500 transition-colors ${
                        taskFilterStatus === status
                          ? 'bg-navy-800 text-white'
                          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      {status === 'all'
                        ? 'Todas'
                        : status === 'pendiente'
                        ? 'Pendientes'
                        : status === 'en_progreso'
                        ? 'En progreso'
                        : 'Completadas'}
                    </button>
                  ))}
                </div>

                <TasksList
                  tareas={tareas}
                  loading={tareasLoading}
                  error={tareasError}
                  onStatusChange={updateTaskStatus}
                  filterStatus={taskFilterStatus}
                />
              </div>
            )}

            {/* Reportes Tab */}
            {activeTab === 'reportes' && (
              <div className="p-8 text-center bg-neutral-50 rounded-lg border border-neutral-200">
                <BarChart3 size={48} className="mx-auto text-neutral-400 mb-4" />
                <h3 className="text-lg font-600 text-neutral-700 mb-2">Reportes</h3>
                <p className="text-neutral-600">
                  Los reportes estarán disponibles próximamente
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <PortalBottomNav />
      </div>

      {/* Espacio Detail Modal */}
      <EspacioDetailModal
        espacio={selectedEspacio}
        bookings={reservas}
        bookingsLoading={bookingsLoading}
        bookingsError={bookingsError}
        onClose={() => setSelectedEspacio(null)}
        onCancel={cancelReservation}
      />
    </div>
  );
};
