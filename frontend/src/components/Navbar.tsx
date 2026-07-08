import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo-vicentinos.svg';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Equipos', href: '/equipos' },
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

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Vicentinos"
              className="h-10 w-auto sm:h-10 md:h-10"
              style={{ width: 'auto', height: '40px' }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-navy-800'
                    : 'text-navy-600 hover:text-navy-800'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500" />
                )}
              </button>
            ))}
          </div>

          {/* Right Section: Auth Button or User Name (Desktop) */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated && usuario ? (
              <button
                onClick={handleUserNameClick}
                className="px-4 py-2 text-sm font-medium text-navy-800 hover:text-gold-500 transition-colors"
              >
                {usuario.email}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-600 transition-colors text-sm font-medium"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-navy-800 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 border-t border-gray-300">
            {/* Mobile Navigation Links */}
            <div className="space-y-1 py-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    navigate(link.href);
                    handleNavClick();
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.href)
                      ? 'bg-gold-500 bg-opacity-10 text-navy-800'
                      : 'text-navy-600 hover:bg-gray-100 hover:text-navy-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-300 pt-2 mt-2">
              {isAuthenticated && usuario ? (
                <button
                  onClick={handleUserNameClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-navy-800 hover:bg-gray-100"
                >
                  {usuario.email}
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    handleNavClick();
                  }}
                  className="block w-full px-3 py-2 rounded-md bg-navy-800 text-white text-center font-medium hover:bg-navy-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
