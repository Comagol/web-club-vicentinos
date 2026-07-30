import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEmployeeTasks } from '../hooks/useEmployeeTasks';
import { tareaService } from '../services/api';
import { Navbar } from '../components/Navbar';
import { TaskFilterBar } from '../components/employee/TaskFilterBar';
import { TasksList } from '../components/employee/TasksList';
import { TaskDetailModal } from '../components/employee/TaskDetailModal';
import { Tarea } from '../types/models';

export const EmployeeOperationsPage: React.FC = () => {
  const { usuario } = useAuth();
  const { tareas, filteredTareas, isLoading, error, applyFilters, refetch, filters } = useEmployeeTasks();

  // State for modal
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get selected task from all tasks (not just filtered)
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tareas.find((t) => t.id === selectedTaskId) || null;
  }, [selectedTaskId, tareas]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const total = tareas.length;
    const inProgress = tareas.filter((t) => t.estado === 'en_progreso').length;
    const completedToday = tareas.filter(
      (t) => t.estado === 'completado' && t.fechaVencimiento === todayStr
    ).length;
    const overdue = tareas.filter(
      (t) => t.fechaVencimiento < todayStr && t.estado !== 'completado'
    ).length;

    return { total, inProgress, completedToday, overdue };
  }, [tareas]);

  // Handle view details
  const handleViewDetails = (tareaId: string) => {
    setSelectedTaskId(tareaId);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  // Handle status update
  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      // Update task via API service
      await tareaService.actualizarTarea(taskId, { estado: newStatus as any });

      // Refetch tasks after successful update
      await refetch();
    } catch (err) {
      console.error('Error updating task status:', err);
      throw err;
    }
  };

  // Handle filter change
  const handleFilterChange = (estado?: string, prioridad?: string) => {
    applyFilters(estado, prioridad);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="flex h-full">
        {/* Sidebar Navigation - Desktop Only */}
        <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200 shadow-sm flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-navy-800 mb-8">
              Operativo Empleado
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg bg-navy-800 text-white font-semibold"
              >
                Tareas
              </button>
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
              >
                Reportes
              </button>
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
              >
                Perfil
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Title and Subtitle */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-navy-800">Mis tareas</h2>
              <p className="text-neutral-600 mt-1">
                Gestiona y monitorea tus tareas diarias
              </p>
            </div>

            {/* Stats Cards - 4 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Tasks */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <p className="text-neutral-600 text-sm font-medium mb-2">Total</p>
                <p className="text-4xl font-bold text-navy-800">{stats.total}</p>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <p className="text-neutral-600 text-sm font-medium mb-2">En Progreso</p>
                <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>

              {/* Completed Today */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <p className="text-neutral-600 text-sm font-medium mb-2">Completadas Hoy</p>
                <p className="text-4xl font-bold text-green-600">{stats.completedToday}</p>
              </div>

              {/* Overdue */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <p className="text-neutral-600 text-sm font-medium mb-2">Vencidas</p>
                <p className="text-4xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>

            {/* Error Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                Error al cargar tareas: {error}
              </div>
            )}

            {/* Main Content Section */}
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <h3 className="text-lg font-semibold text-navy-800 mb-4">Filtros</h3>
                <TaskFilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Tasks List */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <h3 className="text-lg font-semibold text-navy-800 mb-4">Tareas</h3>
                <TasksList
                  tareas={filteredTareas}
                  isLoading={isLoading}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        tarea={selectedTask}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

EmployeeOperationsPage.displayName = 'EmployeeOperationsPage';
