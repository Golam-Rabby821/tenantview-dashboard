/**
 * User Management Page
 * 
 * Displays a table of users with role-based filtering.
 * Super admins see all users, org admins see only their tenant's users.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { usersApi } from '@/lib/mock-api';
import { User, PaginatedResponse } from '@/types';
import { getRoleDisplayName } from '@/lib/permissions';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const [usersData, setUsersData] = useState<PaginatedResponse<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const loadUsers = async () => {
      if (!currentTenant) return;

      setIsLoading(true);
      try {
        const data =
          currentUser?.role === 'super_admin'
            ? await usersApi.getAll(page, pageSize)
            : await usersApi.getByTenant(currentTenant.id, page, pageSize);
        setUsersData(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [currentTenant, currentUser?.role, page]);

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <span className="text-foreground">{getRoleDisplayName(user.role)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: 'lastLoginAt',
      header: 'Last Active',
      render: (user: User) => (
        <span className="text-muted-foreground">
          {user.lastLoginAt
            ? format(new Date(user.lastLoginAt), 'MMM d, yyyy')
            : 'Never'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: User) => (
        <span className="text-muted-foreground">
          {format(new Date(user.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User Management"
        description={
          currentUser?.role === 'super_admin'
            ? 'Manage users across all organizations'
            : `Manage users in ${currentTenant?.name || 'your organization'}`
        }
        actions={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        }
      />

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <DataTable
          columns={columns}
          data={usersData?.data || []}
          isLoading={isLoading}
          getRowKey={(user) => user.id}
          emptyMessage="No users found"
        />

        {/* Pagination */}
        {usersData && usersData.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, usersData.total)} of {usersData.total}{' '}
              users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {usersData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(usersData.totalPages, p + 1))
                }
                disabled={page === usersData.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
