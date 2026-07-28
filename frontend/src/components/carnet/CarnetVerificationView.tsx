import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Carnet } from '../../types/models';
import { Badge } from '../ui/Badge';

interface CarnetVerificationViewProps {
  carnet: Carnet;
  verificadoA?: Date;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const CarnetVerificationView: React.FC<CarnetVerificationViewProps> = ({
  carnet,
  verificadoA
}) => {
  // Extract from Socio data if needed - but for public carnet we only have basic info
  const getInitials = (numeroSocio: string): string => {
    return numeroSocio.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(carnet.numeroSocio);
  const verificationTime = verificadoA || new Date();

  return (
    <div className="space-y-lg w-full">
      {/* Success Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-md">
          <div className="bg-success-bg rounded-full p-lg">
            <CheckCircle size={48} className="text-success" />
          </div>
          <div className="text-center">
            <h2 className="text-h2 font-700 text-navy-800">
              Carnet Verificado
            </h2>
            <p className="text-body text-neutral-600 mt-xs">
              Verificado a las {formatTime(verificationTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Carnet Information Card */}
      <div className="bg-gradient-to-br from-navy-800 to-navy-950 rounded-lg shadow-lg overflow-hidden">
        {/* Card Header with Gold Accent */}
        <div className="h-2 bg-gold-500" />

        <div className="p-lg md:p-xl space-y-lg">
          {/* Top Section: Member Number and Photo */}
          <div className="flex gap-lg">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center overflow-hidden border-2 border-gold-300">
                {carnet.fotoPerfil ? (
                  <img
                    src={carnet.fotoPerfil}
                    alt="Member photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-700 text-navy-800">{initials}</span>
                )}
              </div>
            </div>

            {/* Member Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-body-small text-neutral-300 mb-xs">
                  Socio
                </p>
                <p className="text-h3 font-700 text-white mb-xs">
                  #{carnet.numeroSocio}
                </p>
              </div>

              {/* Badges - Discipline and Category */}
              <div className="flex flex-wrap gap-xs">
                {/* Note: Public API response does not include disciplina, categoria, or estadoMembresia fields.
                    These would require API enhancement to be displayed here. */}
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="border-t border-navy-700 pt-lg space-y-md">
            {/* Carnet Status */}
            <div className="flex items-center justify-between">
              <span className="text-label text-neutral-300">Estado del Carnet</span>
              <Badge
                variant={carnet.estado === 'habilitado' ? 'active' : 'inactive'}
              >
                {carnet.estado === 'habilitado' ? 'Habilitado' : 'Inhabilitado'}
              </Badge>
            </div>

            {/* Expiration Date */}
            <div className="flex items-center justify-between">
              <span className="text-label text-neutral-300">Vencimiento</span>
              <span className="text-body-small font-600 text-gold-300">
                {formatDate(carnet.fechaVencimiento)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-neutral-50 rounded-lg p-md text-center border border-neutral-200">
        <p className="text-caption text-neutral-500">
          Este carnet ha sido verificado correctamente.
        </p>
        <p className="text-caption text-neutral-500 mt-xs">
          Club Vicentinos - Verificación Digital
        </p>
      </div>
    </div>
  );
};
