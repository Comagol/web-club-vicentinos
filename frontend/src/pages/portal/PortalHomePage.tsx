import React from 'react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { WelcomeCard } from '../../components/portal/WelcomeCard';
import { QuickStats } from '../../components/portal/QuickStats';
import { RecentActivity } from '../../components/portal/RecentActivity';

export const PortalHomePage: React.FC = () => {
  return (
    <PortalLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <WelcomeCard />

        {/* Quick Stats Section */}
        <QuickStats />

        {/* Recent Activity Section */}
        <RecentActivity />
      </div>
    </PortalLayout>
  );
};
