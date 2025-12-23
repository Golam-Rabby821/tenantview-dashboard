/**
 * Core type definitions for the multi-tenant dashboard.
 * These types establish the contract for authentication, authorization, and data structures.
 */

export type UserRole = 'super_admin' | 'org_admin' | 'member';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TenantState {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  isLoading: boolean;
}

// Permission definitions for role-based access control
export interface Permission {
  canViewAllTenants: boolean;
  canSwitchTenants: boolean;
  canManageUsers: boolean;
  canEditSettings: boolean;
  canViewAnalytics: boolean;
}

// Navigation item type for sidebar
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  requiredRoles: UserRole[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// KPI/Stats types for dashboard
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingInvites: number;
  storageUsed: number;
  storageLimit: number;
}
