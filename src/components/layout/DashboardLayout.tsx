/**
 * Dashboard Layout
 * 
 * Main layout wrapper for authenticated dashboard pages.
 * Includes sidebar and main content area with proper spacing.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
