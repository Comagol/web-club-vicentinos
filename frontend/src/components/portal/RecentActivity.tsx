import React from 'react';
import { FileText, DollarSign, Users, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'payment' | 'carnet' | 'event' | 'general';
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'payment':
      return <DollarSign size={20} className="text-success" />;
    case 'carnet':
      return <FileText size={20} className="text-info-text" />;
    case 'event':
      return <Users size={20} className="text-warning-text" />;
    default:
      return <CheckCircle size={20} className="text-navy-800" />;
  }
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  }

  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const RecentActivity: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: 1,
      title: 'Pago de cuota recibido',
      description: 'Tu pago de membresía ha sido procesado correctamente.',
      date: '2026-07-24',
      type: 'payment',
    },
    {
      id: 2,
      title: 'Carnet renovado',
      description: 'Tu carnet de identidad ha sido renovado y está disponible para descargar.',
      date: '2026-07-15',
      type: 'carnet',
    },
    {
      id: 3,
      title: 'Evento próximo',
      description: 'Torneo de Hockey este domingo a las 14:00 en el polideportivo.',
      date: '2026-07-10',
      type: 'event',
    },
    {
      id: 4,
      title: 'Perfil actualizado',
      description: 'Tus datos personales han sido modificados exitosamente.',
      date: '2026-06-28',
      type: 'general',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h2 font-600 text-navy-800">Actividad Reciente</h2>
        <button className="text-gold-500 text-body font-500 hover:text-gold-700 transition-colors">
          Ver todo →
        </button>
      </div>

      <Card>
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-lg flex gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 pt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-body font-600 text-navy-800">
                      {activity.title}
                    </h3>
                    <p className="text-caption text-gray-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-caption text-gray-500 flex-shrink-0 whitespace-nowrap">
                    {formatDate(activity.date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-caption text-gray-500 mt-4 text-center">
        Mostrando los últimos 4 eventos
      </p>
    </div>
  );
};
