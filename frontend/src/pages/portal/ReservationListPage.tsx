import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { ReservationCard } from '../../components/reservas/ReservationCard';
import { Banner } from '../../components/ui/Banner';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useReservationList } from '../../hooks/useReservationList';

type SortOption = 'newest' | 'oldest';
type StatusFilter = 'all' | 'pendiente' | 'aprobado' | 'rechazado';

export const ReservationListPage: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const navigate = useNavigate();
  const { reservations, espacios, isLoading, error, cancelReservation } = useReservationList();

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<StatusFilter>('all');

  if (authLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </PortalLayout>
    );
  }

  const filteredReservations = useMemo(() => {
    let filtered = reservations;

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((r) => r.estado === filterBy);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.fechaInicio).getTime();
      const dateB = new Date(b.fechaInicio).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [reservations, filterBy, sortBy]);

  const handleCancel = async (reservaId: string) => {
    try {
      await cancelReservation(reservaId);
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-700 text-navy-800 mb-2">
            Mis Reservas
          </h1>
          <p className="text-neutral-600">
            Visualiza y gestiona tus reservas de espacios
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <Banner type="danger">
            <div className="space-y-xs">
              <p className="font-600">Error al cargar reservas</p>
              <p className="text-body-small">{error}</p>
            </div>
          </Banner>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="space-y-2 text-center">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
              </div>
              <p className="text-neutral-600">Cargando reservas...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredReservations.length === 0 && (
          <div className="text-center py-12 bg-neutral-50 rounded-card border-[0.5px] border-neutral-300">
            <h3 className="text-h3 font-600 text-navy-800 mb-2">
              No hay reservas
            </h3>
            <p className="text-neutral-600 mb-6">
              {filterBy !== 'all'
                ? 'No hay reservas con este estado'
                : 'No has realizado ninguna reserva aún'}
            </p>
            {filterBy === 'all' && (
              <button
                onClick={() => navigate('/portal/reservas')}
                className="inline-block px-6 py-2 bg-navy-800 text-white rounded-btn font-600 hover:bg-navy-900 transition-colors"
              >
                Crear Nueva Reserva
              </button>
            )}
          </div>
        )}

        {/* Filters and Sort (Desktop) */}
        {!isLoading && reservations.length > 0 && (
          <div className="hidden md:flex gap-4 items-center bg-neutral-50 p-4 rounded-card border-[0.5px] border-neutral-300">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-body font-500 text-neutral-700">
                Ordenar:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
              </select>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-body font-500 text-neutral-700">
                Estado:
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as StatusFilter)}
                className="px-3 py-2 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy"
              >
                <option value="all">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        )}

        {/* Filters and Sort (Mobile) */}
        {!isLoading && reservations.length > 0 && (
          <div className="md:hidden space-y-3">
            {/* Sort Mobile */}
            <div className="flex items-center gap-2">
              <label className="text-body font-500 text-neutral-700 flex-shrink-0">
                Ordenar:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 px-3 py-2 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
              </select>
            </div>

            {/* Filter Mobile */}
            <div className="flex items-center gap-2">
              <label className="text-body font-500 text-neutral-700 flex-shrink-0">
                Estado:
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as StatusFilter)}
                className="flex-1 px-3 py-2 border-[0.5px] border-neutral-300 rounded-btn text-body font-normal focus:border-navy-800 focus:shadow-focus-navy"
              >
                <option value="all">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        )}

        {/* Reservations List */}
        {!isLoading && filteredReservations.length > 0 && (
          <div>
            <div className="hidden md:block mb-4 text-neutral-600 text-caption font-500 uppercase">
              {filteredReservations.length} reserva{filteredReservations.length > 1 ? 's' : ''}
            </div>
            {filteredReservations.map((reserva) => {
              const espacio = espacios.find((e) => e.id === reserva.espacioId);
              return (
                <ReservationCard
                  key={reserva.id}
                  reserva={reserva}
                  espacioName={espacio?.nombre || 'Espacio Desconocido'}
                  espacioCapacidad={espacio?.capacidad || 0}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                />
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
