import React from 'react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { CarnetDisplay } from '../../components/carnet/CarnetDisplay';
import { Banner } from '../../components/ui/Banner';
import { Button } from '../../components/ui/Button';
import { useCarnet } from '../../hooks/useCarnet';
import { useAuth } from '../../hooks/useAuth';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export const CarnetPage: React.FC = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const { usuario } = useAuth();
  const { data: carnet, loading, error, refetch } = useCarnet();

  if (authLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-lg">
        {/* Page Title */}
        <div>
          <h1 className="text-h1 font-700 text-navy-800 mb-xs">
            Mi Carnet Digital
          </h1>
          <p className="text-body text-neutral-600">
            Tu carnet digital de socio con código QR para verificación
          </p>
        </div>

        {/* Loading State */}
        {loading && !carnet && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-md">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-navy-200 border-t-navy-800 rounded-full animate-spin"></div>
              </div>
              <p className="text-body text-neutral-600">Cargando tu carnet...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="space-y-md">
            <Banner type="danger">
              <div className="space-y-xs">
                <p className="font-600">No se pudo cargar tu carnet</p>
                <p className="text-body-small">{error}</p>
              </div>
            </Banner>
            <div className="flex gap-sm">
              <Button
                variant="primary"
                size="md"
                onClick={refetch}
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        )}

        {/* Success State */}
        {carnet && usuario && (
          <CarnetDisplay carnet={carnet} member={usuario} />
        )}

        {/* No Data State */}
        {!loading && !error && !carnet && (
          <Banner type="warning">
            <div className="space-y-xs">
              <p className="font-600">Tu carnet digital no está disponible</p>
              <p className="text-body-small">
                Por favor, contacta con administración para obtener tu carnet digital.
              </p>
            </div>
          </Banner>
        )}
      </div>
    </PortalLayout>
  );
};
