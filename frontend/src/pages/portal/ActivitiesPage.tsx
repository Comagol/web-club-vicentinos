import React, { useState, useCallback } from 'react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { ActivitiesList } from '../../components/activities/ActivitiesList';
import { ActivityFilterBar } from '../../components/activities/ActivityFilterBar';
import { ActivityDetailModal } from '../../components/activities/ActivityDetailModal';
import { Banner } from '../../components/ui/Banner';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useActivities } from '../../hooks/useActivities';
import { useActivityDetail } from '../../hooks/useActivityDetail';
import { ActivityStatusFilter } from '../../components/activities/ActivityFilterBar';

export const ActivitiesPage: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const {
    actividades,
    loading: activitiesLoading,
    error: activitiesError,
    clearError: clearActivitiesError,
  } = useActivities();

  const {
    actividad,
    loading: detailLoading,
    error: detailError,
    fetchActivityDetail,
    enrollInActivity,
    isEnrolling,
    enrollmentError,
    clearErrors: clearDetailErrors,
  } = useActivityDetail();

  const [selectedStatus, setSelectedStatus] = useState<ActivityStatusFilter>('all');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (authLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </PortalLayout>
    );
  }

  const handleActivityClick = useCallback(
    (actividadId: string) => {
      setSelectedActivityId(actividadId);
      setIsModalOpen(true);
      fetchActivityDetail(actividadId);
      clearDetailErrors();
    },
    [fetchActivityDetail, clearDetailErrors]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivityId(null);
    clearDetailErrors();
  }, [clearDetailErrors]);

  const handleEnroll = useCallback(
    async (actividadId: string) => {
      try {
        await enrollInActivity(actividadId);
      } catch (err) {
        // Error is handled by the hook and displayed in the modal
        console.error('Enrollment error:', err);
      }
    },
    [enrollInActivity]
  );

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Page Title */}
        <div>
          <h1 className="text-h1 font-700 text-navy-800 mb-xs">
            Actividades Recaudatorias
          </h1>
          <p className="text-body text-neutral-600">
            Participa en nuestras actividades de recaudación y apoya al club
          </p>
        </div>

        {/* General Error Banner */}
        {activitiesError && (
          <Banner type="danger">
            <div className="space-y-xs">
              <p className="font-600">Error al cargar actividades</p>
              <p className="text-body-small">{activitiesError}</p>
            </div>
          </Banner>
        )}

        {/* Filter Bar */}
        <ActivityFilterBar
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* Activities List */}
        <ActivitiesList
          actividades={actividades}
          selectedStatus={selectedStatus}
          onActivityClick={handleActivityClick}
          loading={activitiesLoading}
          error={activitiesError}
        />

        {/* Detail Modal */}
        {actividad && (
          <ActivityDetailModal
            actividad={actividad}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onEnroll={handleEnroll}
            isEnrolling={isEnrolling}
            enrollmentError={enrollmentError}
          />
        )}
      </div>
    </PortalLayout>
  );
};
