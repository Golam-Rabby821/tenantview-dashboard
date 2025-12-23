/**
 * Dashboard Sidebar
 * 
 * Role-aware navigation sidebar with tenant switcher for super admins.
 * Architecture Decision: Navigation items are filtered at render time based
 * on the user's role, ensuring unauthorized items never appear in the UI.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Building2,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { getNavigationForRole, getRoleDisplayName } from '@/lib/permissions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Settings,
};

export const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTenant, availableTenants, switchTenant } = useTenant();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = getNavigationForRole(user.role);
  const canSwitchTenants = user.role === 'super_admin';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar shadow-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo & Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            AdminHub
          </span>
        </div>

        {/* Tenant Switcher */}
        <div className="border-b border-sidebar-border p-4">
          {canSwitchTenants ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-sidebar-muted" />
                  <span className="font-medium truncate max-w-[140px]">
                    {currentTenant?.name || 'Select Tenant'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-muted" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {availableTenants.map((tenant) => (
                  <DropdownMenuItem
                    key={tenant.id}
                    onClick={() => switchTenant(tenant.id)}
                    className={cn(
                      'cursor-pointer',
                      currentTenant?.id === tenant.id && 'bg-accent'
                    )}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    {tenant.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground">
              <Building2 className="h-4 w-4 text-sidebar-muted" />
              <span className="font-medium truncate">
                {currentTenant?.name || 'Loading...'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-sidebar-muted">
                {getRoleDisplayName(user.role)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};
