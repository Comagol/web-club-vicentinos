import React, { useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useManagerTasks } from '../hooks/useManagerTasks';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { TeamMembersPanel } from '../components/manager/TeamMembersPanel';
import { TaskFilterBar } from '../components/manager/TaskFilterBar';
import { TeamTasksList } from '../components/manager/TeamTasksList';
import { AssignTaskModal } from '../components/manager/AssignTaskModal';
import { Navbar } from '../components/Navbar';

type StatusFilter = 'all' | 'pendiente' | 'en_progreso' | 'completado';
type PriorityFilter = 'all' | 'baja' | 'media' | 'alta';

export const ManagerOperationsPage: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();

  // State
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();

  // Hooks
  const {
    tasks,
    stats,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
  } = useManagerTasks();

  const {
    members,
    isLoading: membersLoading,
    error: membersError,
    updateMemberStats,
  } = useTeamMembers();

  // Update member stats when tasks change
  React.useEffect(() => {
    updateMemberStats(tasks);
  }, [tasks, updateMemberStats]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  const isLoading = tasksLoading || membersLoading;

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: 'pendiente' | 'en_progreso' | 'completado',
  ) => {
    try {
      await updateTask(taskId, { estado: newStatus });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-navy mb-8">
              Gestor Operativo
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg bg-navy text-white font-semibold"
              >
                Tareas
              </button>
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Equipo
              </button>
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Reportes
              </button>
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Configuración
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Title and Action */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Mis tareas</h2>
                <p className="text-gray-600 mt-1">
                  Gestiona y monitorea las tareas de tu equipo
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy-dark transition-colors"
              >
                + Nueva tarea
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-600 text-sm mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pendiente}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-600 text-sm mb-1">En progreso</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.en_progreso}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-600 text-sm mb-1">Completadas</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completado}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-600 text-sm mb-1">Vencidas</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.vencidas}
                </p>
              </div>
            </div>

            {/* Error Messages */}
            {tasksError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                Error al cargar tareas: {tasksError}
              </div>
            )}
            {membersError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                Error al cargar equipo: {membersError}
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-4 gap-6">
              {/* Tasks Column (main) */}
              <div className="col-span-3 space-y-6">
                {/* Filter Bar */}
                <TaskFilterBar
                  status={statusFilter}
                  priority={priorityFilter}
                  assignee={assigneeFilter}
                  members={members}
                  onStatusChange={setStatusFilter}
                  onPriorityChange={setPriorityFilter}
                  onAssigneeChange={setAssigneeFilter}
                />

                {/* Tasks List */}
                <TeamTasksList
                  tasks={tasks}
                  members={members}
                  status={statusFilter}
                  priority={priorityFilter}
                  assignee={assigneeFilter}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                  sortBy="dueDate"
                />
              </div>

              {/* Team Members Sidebar */}
              <div className="col-span-1">
                <TeamMembersPanel
                  members={members}
                  selectedMemberId={selectedMemberId}
                  onSelectMember={(memberId) => {
                    setSelectedMemberId(
                      selectedMemberId === memberId ? undefined : memberId,
                    );
                    setAssigneeFilter(
                      assigneeFilter === memberId ? 'all' : memberId,
                    );
                  }}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={members}
        onSubmit={handleCreateTask}
        isLoading={isLoading}
      />
    </div>
  );
};
