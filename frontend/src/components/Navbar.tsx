import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Noticias', href: '/news' },
  { label: 'Equipos', href: '/teams' },
  { label: 'Boutique', href: '/boutique' },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string): boolean => {
    return location.pathname === href;
  };

  const handleUserNameClick = () => {
    navigate('/dashboard');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-navy-800 rounded flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="hidden sm:inline text-sm font-600 text-navy-800">
            Vicentinos
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              onClick={() => navigate(link.href)}
              className={`text-sm font-400 cursor-pointer transition-colors ${
                isActive(link.href)
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-navy-800 hover:text-navy-600'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Section (Desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated && usuario ? (
            <button
              onClick={handleUserNameClick}
              className="px-4 py-2 text-sm font-500 text-navy-800 hover:text-navy-600"
            >
              {usuario.email || usuario.email}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 h-10 bg-navy-800 text-white text-sm font-500 rounded-lg hover:opacity-88 transition-opacity"
            >
              Inicia sesión
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 text-navy-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-300 px-6 py-4 space-y-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              onClick={() => {
                navigate(link.href);
                setMobileMenuOpen(false);
              }}
              className={`block text-sm font-400 cursor-pointer ${
                isActive(link.href) ? 'text-gold-500 font-600' : 'text-navy-800'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-gray-300 pt-4">
            {isAuthenticated && usuario ? (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm font-500 text-navy-800"
              >
                Mi Cuenta ({usuario.email || usuario.email})
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-navy-800 text-white text-sm font-500 rounded-lg hover:opacity-88"
              >
                Inicia sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
