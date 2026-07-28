import React from 'react';
import { User } from 'lucide-react';
import { Carnet, Socio } from '../../types/models';
import { Badge } from '../ui/Badge';
import { QRCodeGenerator } from './QRCodeGenerator';

interface CarnetDisplayProps {
  carnet: Carnet;
  member: Socio;
}

const getStatusVariant = (estado: string) => {
  switch (estado) {
    case 'activo':
      return 'active';
    case 'suspendido':
      return 'pending';
    case 'inactivo':
      return 'inactive';
    default:
      return 'gray';
  }
};

const getDisciplineVariant = (disciplina: string) => {
  switch (disciplina) {
    case 'rugby':
      return 'rugby';
    case 'hockey':
      return 'hockey';
    default:
      return 'gray';
  }
};

const getCategoryLabel = (categoria: string) => {
  const labels: Record<string, string> = {
    adulto: 'Adulto',
    joven: 'Joven',
    junior: 'Junior',
    pensionista: 'Pensionista',
  };
  return labels[categoria] || categoria;
};

const getStatusLabel = (estado: string) => {
  const labels: Record<string, string> = {
    activo: 'Activo',
    suspendido: 'Suspendido',
    inactivo: 'Inactivo',
  };
  return labels[estado] || estado;
};

export const CarnetDisplay: React.FC<CarnetDisplayProps> = ({ carnet, member }) => {
  // Extract initials for avatar
  const getInitials = (): string => {
    const fullName = `${member.nombre} ${member.apellido}`;
    return fullName
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const initials = getInitials();

  return (
    <div className="space-y-lg">
      {/* Main Carnet Card */}
      <div className="bg-gradient-to-br from-navy-800 to-navy-950 rounded-lg shadow-lg overflow-hidden">
        {/* Card Header with Gold Accent */}
        <div className="h-2 bg-gold-500" />

        <div className="p-lg md:p-xl space-y-lg">
          {/* Top Section: Photo and Member Info */}
          <div className="flex gap-lg">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center overflow-hidden border-2 border-gold-300">
                {member.fotoPerfil ? (
                  <img
                    src={member.fotoPerfil}
                    alt={`${member.nombre} ${member.apellido}`}
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
                <h2 className="text-xl font-700 text-white mb-xs">
                  {member.nombre} {member.apellido}
                </h2>
                <p className="text-body-small text-gold-300 font-600 mb-md">
                  Socio #{member.numeroSocio}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-xs">
                <Badge variant={getDisciplineVariant(member.disciplina)}>
                  {member.disciplina === 'rugby' ? 'Rugby' : 'Hockey'}
                </Badge>
                <Badge variant="gray">{getCategoryLabel(member.categoria)}</Badge>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="border-t border-navy-700 pt-lg">
            <div className="flex items-center justify-between mb-md">
              <span className="text-label text-neutral-300">Estado de membresía</span>
              <Badge variant={getStatusVariant(member.estadoMembresia)}>
                {getStatusLabel(member.estadoMembresia)}
              </Badge>
            </div>

            {/* Expiration Info */}
            <div className="flex items-center justify-between">
              <span className="text-label text-neutral-300">Vencimiento</span>
              <span className="text-body-small font-600 text-gold-300">
                {formatDate(carnet.fechaVencimiento)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-lg shadow p-lg md:p-xl">
        <h3 className="text-h3 font-600 text-navy-800 mb-lg text-center">
          Código de Verificación
        </h3>
        <QRCodeGenerator carnetId={carnet.id} />
      </div>

      {/* Carnet Info Footer */}
      <div className="bg-neutral-50 rounded-lg p-md text-center">
        <p className="text-caption text-neutral-500">
          ID: <span className="font-600 text-neutral-700">{carnet.id}</span>
        </p>
        <p className="text-caption text-neutral-500 mt-xs">
          Estado: <span className="font-600 text-neutral-700">
            {carnet.estado === 'habilitado' ? 'Habilitado' : 'Inhabilitado'}
          </span>
        </p>
      </div>
    </div>
  );
};
