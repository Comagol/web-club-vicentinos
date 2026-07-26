import React from 'react';
import { User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const WelcomeCard: React.FC = () => {
  const { usuario } = useAuth();

  // Extract name from email or use email as fallback
  const displayName = usuario?.email?.split('@')[0] || 'Miembro';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <Card className="bg-gradient-to-r from-navy-800 to-navy-600 border-0 mb-6">
      <Card.Body className="p-xl text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-h1 font-700 mb-2">
              ¡Bienvenido, {capitalizedName}!
            </h1>
            <p className="text-body text-navy-100 mb-6">
              Aquí encontrarás toda la información de tu membresía y acceso rápido a tus trámites.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="gold"
                size="md"
                onClick={() => window.location.href = '/portal/membership'}
              >
                Ver Mi Membresía
              </Button>
              <Button
                variant="outline"
                size="md"
                className="border-white text-white hover:bg-white hover:text-navy-800"
                onClick={() => window.location.href = '/portal/profile'}
              >
                Mi Perfil
              </Button>
            </div>
          </div>
          <div className="hidden sm:flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full">
            <User size={48} className="text-white" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
