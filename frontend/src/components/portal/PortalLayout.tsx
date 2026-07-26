import React from 'react';
import { PortalSidebar } from './PortalSidebar';
import { PortalBottomNav } from './PortalBottomNav';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <PortalSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto pb-20 md:pb-0">
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <PortalBottomNav />
      </div>
    </div>
  );
};
