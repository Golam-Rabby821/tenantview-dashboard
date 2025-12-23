/**
 * Permission Utilities
 * 
 * Centralized permission logic based on user roles.
 * Architecture Decision: Keeping permissions in one place makes it easy to audit
 * and modify access control rules without hunting through components.
 */

import { UserRole, Permission, NavItem } from '@/types';

/**
 * Get permissions for a given role
 */
export const getPermissions = (role: UserRole): Permission => {
  switch (role) {
    case 'super_admin':
      return {
        canViewAllTenants: true,
        canSwitchTenants: true,
        canManageUsers: true,
        canEditSettings: true,
        canViewAnalytics: true,
      };
    case 'org_admin':
      return {
        canViewAllTenants: false,
        canSwitchTenants: false,
        canManageUsers: true,
        canEditSettings: true,
        canViewAnalytics: true,
      };
    case 'member':
      return {
        canViewAllTenants: false,
        canSwitchTenants: false,
        canManageUsers: false,
        canEditSettings: false,
        canViewAnalytics: true,
      };
  }
};

/**
 * Check if a role has access to a specific permission
 */
export const hasPermission = (
  role: UserRole,
  permission: keyof Permission
): boolean => {
  return getPermissions(role)[permission];
};

/**
 * Navigation items with role-based visibility
 */
export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    requiredRoles: ['super_admin', 'org_admin', 'member'],
  },
  {
    label: 'Users',
    path: '/dashboard/users',
    icon: 'Users',
    requiredRoles: ['super_admin', 'org_admin'],
  },
  {
    label: 'Settings',
    path: '/dashboard/settings',
    icon: 'Settings',
    requiredRoles: ['super_admin', 'org_admin'],
  },
];

/**
 * Filter navigation items based on user role
 */
export const getNavigationForRole = (role: UserRole): NavItem[] => {
  return navigationItems.filter(item => item.requiredRoles.includes(role));
};

/**
 * Check if a user can access a specific route
 */
export const canAccessRoute = (role: UserRole, path: string): boolean => {
  const navItem = navigationItems.find(item => item.path === path);
  if (!navItem) return true; // Allow access to unlisted routes by default
  return navItem.requiredRoles.includes(role);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'org_admin':
      return 'Organization Admin';
    case 'member':
      return 'Member';
  }
};
