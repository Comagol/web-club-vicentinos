import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarnetVerificationView } from '../components/carnet/CarnetVerificationView';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { useCarnetPublic } from '../hooks/useCarnetPublic';

/**
 * Public page for verifying member carnet via QR code
 * Route: /carnet/:id/verificar
 * No authentication required
 */
export const CarnetVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: carnet, isLoading, error, refetch } = useCarnetPublic(id);
  const verificationTime = React.useRef(new Date());

  if (!id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-md">
        <div className="max-w-md w-full">
          <Banner type="danger">
            <div className="space-y-xs">
              <p className="font-600">ID de carnet no válido</p>
              <p className="text-body-small">El ID del carnet no ha sido proporcionado correctamente.</p>
            </div>
          </Banner>
          <div className="mt-lg text-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Minimal branding */}
      <header className="bg-navy-800 text-white py-lg md:py-xl px-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 font-700 mb-xs">
            Verificación de Carnet
          </h1>
          <p className="text-body text-neutral-200">
            Escanea o accede mediante enlace para verificar un carnet
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-lg md:py-xl px-md">
        <div className="max-w-md w-full">
          {/* Loading State */}
          {isLoading && !carnet && (
            <div className="text-center space-y-lg">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-navy-200 border-t-navy-800 rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-body font-600 text-navy-800 mb-xs">
                  Verificando carnet...
                </p>
                <p className="text-body-small text-neutral-600">
                  Por favor espera mientras verificamos tu carnet
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-lg">
              <Banner type="danger">
                <div className="space-y-xs">
                  <p className="font-600">No se pudo verificar el carnet</p>
                  <p className="text-body-small">{error}</p>
                  {error.includes('no encontrado') && (
                    <p className="text-body-small mt-xs text-neutral-600">
                      Verifica que el ID o QR sea correcto
                    </p>
                  )}
                  {error.includes('inhabilitado') && (
                    <p className="text-body-small mt-xs text-neutral-600">
                      Este carnet no está habilitado actualmente
                    </p>
                  )}
                </div>
              </Banner>
              <div className="flex gap-sm">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => refetch()}
                  className="flex-1"
                >
                  Intentar de nuevo
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Volver
                </Button>
              </div>
            </div>
          )}

          {/* Success State */}
          {carnet && !error && (
            <CarnetVerificationView
              carnet={carnet}
              verificadoA={verificationTime.current}
            />
          )}

          {/* No Data State */}
          {!isLoading && !error && !carnet && (
            <Banner type="warning">
              <div className="space-y-xs">
                <p className="font-600">Carnet no disponible</p>
                <p className="text-body-small">
                  Por favor, verifica el ID del carnet e intenta de nuevo
                </p>
              </div>
            </Banner>
          )}
        </div>
      </main>

      {/* Footer - Minimal branding */}
      <footer className="bg-neutral-50 border-t border-neutral-200 py-md px-md">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-caption text-neutral-600">
            Club Vicentinos - Verificación Digital de Carnets
          </p>
        </div>
      </footer>
    </div>
  );
};
