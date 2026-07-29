import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, CheckSquare, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SUBCOMISION_LINKS = [
  { label: 'Espacios', href: '/gestion/subcomision', icon: Building2 },
  { label: 'Tareas', href: '/gestion/subcomision/tareas', icon: CheckSquare },
  { label: 'Reportes', href: '/gestion/subcomision/reportes', icon: BarChart3 },
  { label: 'Configuración', href: '/gestion/subcomision/config', icon: Settings },
];

export const SubcomisionSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isLoading, usuario } = useAuth();

  const isActive = (href: string): boolean => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 bg-navy-800 h-screen flex flex-col fixed left-0 top-0 md:static">
      <div className="p-6 border-b border-navy-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded flex items-center justify-center text-navy-800 font-bold">
            V
          </div>
          <div className="flex-1">
            <span className="text-white font-600 block">Vicentinos</span>
            <span className="text-xs text-navy-200">Subcomisión</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {SUBCOMISION_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-gold-500 text-navy-800 font-600'
                  : 'text-navy-100 hover:bg-navy-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-500">{link.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-navy-600 space-y-4">
        {usuario && (
          <div className="text-xs">
            <p className="text-navy-200">Conectado como:</p>
            <p className="text-white font-500 truncate">{usuario.email}</p>
            <p className="text-navy-300 text-xs mt-1">Subcomisión</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-navy-100 hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={20} />
          <span className="text-sm font-500">
            {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
          </span>
        </button>
      </div>
    </aside>
  );
};
