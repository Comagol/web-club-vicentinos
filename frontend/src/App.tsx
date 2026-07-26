import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { NewsPage } from './pages/NewsPage';
import { TeamsPage } from './pages/TeamsPage';
import { BoutiquePage } from './pages/BoutiquePage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PortalDashboard } from './pages/portal/PortalDashboard';

const AppRoutes: React.FC = () => {
  const { restoreSession, isLoading } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/boutique" element={<BoutiquePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Portal Routes - All Protected */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <PortalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/membership"
        element={
          <ProtectedRoute>
            <div>Membership Page (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/calendar"
        element={
          <ProtectedRoute>
            <div>Calendar Page (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/finances"
        element={
          <ProtectedRoute>
            <div>Finances Page (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/profile"
        element={
          <ProtectedRoute>
            <div>Profile Page (Coming Soon)</div>
          </ProtectedRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};
