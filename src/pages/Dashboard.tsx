/**
 * Dashboard Overview Page
 * 
 * Displays KPI cards and summary statistics.
 * Data is tenant-aware and refreshes when the tenant changes.
 */

import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserPlus, HardDrive } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { dashboardApi } from '@/lib/mock-api';
import { DashboardStats } from '@/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentTenant) return;

      setIsLoading(true);
      try {
        const data =
          user?.role === 'super_admin'
            ? await dashboardApi.getGlobalStats()
            : await dashboardApi.getStats(currentTenant.id);
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [currentTenant, user?.role]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] || 'User'}`}
        description={
          user?.role === 'super_admin'
            ? `Viewing global statistics across all organizations`
            : `Viewing statistics for ${currentTenant?.name || 'your organization'}`
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={isLoading ? '—' : stats?.totalUsers || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value={isLoading ? '—' : stats?.activeUsers || 0}
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Pending Invites"
          value={isLoading ? '—' : stats?.pendingInvites || 0}
          icon={UserPlus}
        />
        <StatCard
          title="Storage Used"
          value={
            isLoading
              ? '—'
              : `${stats?.storageUsed || 0} / ${stats?.storageLimit || 0} GB`
          }
          subtitle={
            stats
              ? `${Math.round((stats.storageUsed / stats.storageLimit) * 100)}% used`
              : undefined
          }
          icon={HardDrive}
        />
      </div>

      {/* Quick Info Cards */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {user?.role !== 'member' && (
              <>
                <a
                  href="/dashboard/users"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      Invite Team Members
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add new users to your organization
                    </p>
                  </div>
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      Organization Settings
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Configure your organization preferences
                    </p>
                  </div>
                </a>
              </>
            )}
            {user?.role === 'member' && (
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-muted-foreground">
                  Contact your organization admin to manage users and settings.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Current Session
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Logged in as</span>
              <span className="font-medium text-card-foreground">
                {user?.email}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium text-card-foreground capitalize">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organization</span>
              <span className="font-medium text-card-foreground">
                {currentTenant?.name || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
