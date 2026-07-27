import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, CreditCard, Calendar, DollarSign, User } from 'lucide-react';

const PORTAL_LINKS = [
  { label: 'Inicio', href: '/portal', icon: Home },
  { label: 'Membresía', href: '/portal/membership', icon: CreditCard },
  { label: 'Calendario', href: '/portal/calendar', icon: Calendar },
  { label: 'Cuotas', href: '/portal/cuotas', icon: DollarSign },
  { label: 'Perfil', href: '/portal/profile', icon: User },
];

export const PortalBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string): boolean => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-white border-t border-gray-300 flex">
      {PORTAL_LINKS.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <button
            key={link.href}
            onClick={() => navigate(link.href)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
              active
                ? 'text-gold-500 border-t-2 border-gold-500'
                : 'text-gray-700 hover:text-navy-800'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-500 mt-1">{link.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
