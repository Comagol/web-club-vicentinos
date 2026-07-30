import React, { useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useAdminUsers, UserFilters } from '../hooks/useAdminUsers';
import { useSystemStats } from '../hooks/useSystemStats';
import { SystemStats } from '../components/admin/SystemStats';
import { UserFilterBar, RoleFilterValue, StatusFilterValue } from '../components/admin/UserFilterBar';
import { UsersList } from '../components/admin/UsersList';
import { CreateUserModal } from '../components/admin/CreateUserModal';
import { UserDetailModal } from '../components/admin/UserDetailModal';
import { ActivityLog } from '../components/admin/ActivityLog';
import { Banner, Button } from '../components/ui';
import { Socio } from '../types/models';
import { Navbar } from '../components/Navbar';

type SidebarSection = 'usuarios' | 'configuracion' | 'reportes' | 'logs';

export const AdminPanel: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();

  const [activeSection, setActiveSection] = useState<SidebarSection>('usuarios');
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Socio | null>(null);

  const filters: UserFilters = {
    rol: roleFilter,
    estadoMembresia: statusFilter,
    busqueda: searchFilter || undefined,
  };

  const { users, isLoading, error, activityLog, createUser, updateUser, deleteUser, clearError } =
    useAdminUsers(filters);
  const { stats } = useSystemStats(users, isLoading);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  const handleApplyFilters = (next: { role: RoleFilterValue; status: StatusFilterValue; search: string }) => {
    setRoleFilter(next.role);
    setStatusFilter(next.status);
    setSearchFilter(next.search);
  };

  const handleClearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSearchFilter('');
  };

  const handleDelete = async (user: Socio) => {
    try {
      await deleteUser(user.id);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const sidebarItems: { key: SidebarSection; label: string }[] = [
    { key: 'usuarios', label: 'Usuarios' },
    { key: 'configuracion', label: 'Configuración' },
    { key: 'reportes', label: 'Reportes' },
    { key: 'logs', label: 'Logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-navy-800 mb-8">Panel de administración</h1>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeSection === item.key
                      ? 'bg-navy-800 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'usuarios' && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Usuarios</h2>
                    <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
                  </div>
                  <Button variant="gold" onClick={() => setIsCreateModalOpen(true)}>
                    + Nuevo usuario
                  </Button>
                </div>

                <SystemStats stats={stats} isLoading={isLoading} />

                {error && (
                  <div className="mb-6">
                    <Banner type="danger" onClose={clearError}>
                      {error}
                    </Banner>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-3 space-y-6">
                    <UserFilterBar
                      role={roleFilter}
                      status={statusFilter}
                      search={searchFilter}
                      onApply={handleApplyFilters}
                      onClear={handleClearFilters}
                    />

                    <UsersList
                      users={users}
                      isLoading={isLoading}
                      onEdit={setSelectedUser}
                      onDelete={handleDelete}
                    />
                  </div>

                  <div className="col-span-1">
                    <ActivityLog entries={activityLog} />
                  </div>
                </div>
              </>
            )}

            {activeSection === 'configuracion' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuración</h2>
                <p className="text-gray-600">Próximamente.</p>
              </div>
            )}

            {activeSection === 'reportes' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Reportes</h2>
                <p className="text-gray-600">Próximamente.</p>
              </div>
            )}

            {activeSection === 'logs' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Logs del sistema</h2>
                <ActivityLog entries={activityLog} />
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createUser}
      />

      <UserDetailModal
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={updateUser}
        onDelete={deleteUser}
      />
    </div>
  );
};
