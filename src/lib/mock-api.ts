/**
 * Mock API Layer
 * 
 * This module simulates backend API calls with realistic delays and error states.
 * Architecture Decision: Centralized mock data prevents hardcoding in components
 * and makes it trivial to swap with real API calls later.
 * 
 * To migrate to real backend:
 * 1. Replace mock implementations with actual fetch/axios calls
 * 2. Update response handling to match your API contract
 * 3. Add proper error handling and retry logic
 */

import { User, Tenant, DashboardStats, PaginatedResponse, UserRole } from '@/types';

// Simulated network delay (ms)
const MOCK_DELAY = 500;

// Helper to simulate async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Tenants Data
export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Acme Corporation',
    slug: 'acme',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tenant-2',
    name: 'TechStart Inc',
    slug: 'techstart',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'tenant-3',
    name: 'Global Dynamics',
    slug: 'global-dynamics',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'superadmin@platform.com',
    name: 'Sarah Chen',
    role: 'super_admin',
    tenantId: 'tenant-1',
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-12-22T08:30:00Z',
    status: 'active',
  },
  {
    id: 'user-2',
    email: 'admin@acme.com',
    name: 'Michael Torres',
    role: 'org_admin',
    tenantId: 'tenant-1',
    createdAt: '2024-01-20T11:00:00Z',
    lastLoginAt: '2024-12-21T14:20:00Z',
    status: 'active',
  },
  {
    id: 'user-3',
    email: 'member@acme.com',
    name: 'Emily Watson',
    role: 'member',
    tenantId: 'tenant-1',
    createdAt: '2024-02-05T09:00:00Z',
    lastLoginAt: '2024-12-20T16:45:00Z',
    status: 'active',
  },
  {
    id: 'user-4',
    email: 'admin@techstart.com',
    name: 'David Kim',
    role: 'org_admin',
    tenantId: 'tenant-2',
    createdAt: '2024-02-20T14:30:00Z',
    lastLoginAt: '2024-12-19T10:00:00Z',
    status: 'active',
  },
  {
    id: 'user-5',
    email: 'member@techstart.com',
    name: 'Lisa Park',
    role: 'member',
    tenantId: 'tenant-2',
    createdAt: '2024-02-25T08:00:00Z',
    status: 'pending',
  },
  {
    id: 'user-6',
    email: 'admin@global.com',
    name: 'James Wilson',
    role: 'org_admin',
    tenantId: 'tenant-3',
    createdAt: '2024-03-10T09:15:00Z',
    lastLoginAt: '2024-12-18T12:30:00Z',
    status: 'active',
  },
  {
    id: 'user-7',
    email: 'member1@global.com',
    name: 'Anna Schmidt',
    role: 'member',
    tenantId: 'tenant-3',
    createdAt: '2024-03-15T10:00:00Z',
    status: 'inactive',
  },
  {
    id: 'user-8',
    email: 'member2@global.com',
    name: 'Carlos Rivera',
    role: 'member',
    tenantId: 'tenant-3',
    createdAt: '2024-03-20T11:00:00Z',
    lastLoginAt: '2024-12-17T09:00:00Z',
    status: 'active',
  },
];

/**
 * Authentication API
 */
export const authApi = {
  login: async (role: UserRole, tenantId: string): Promise<User> => {
    await delay(MOCK_DELAY);
    
    // Find a user matching the role and tenant
    let user = mockUsers.find(u => u.role === role && u.tenantId === tenantId);
    
    // For super_admin, any tenant works
    if (role === 'super_admin') {
      user = mockUsers.find(u => u.role === 'super_admin');
    }
    
    if (!user) {
      // Create a mock user if none exists
      user = {
        id: `user-${Date.now()}`,
        email: `${role}@${tenantId}.com`,
        name: role === 'super_admin' ? 'Super Admin' : role === 'org_admin' ? 'Org Admin' : 'Member',
        role,
        tenantId,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        status: 'active',
      };
    }
    
    return user;
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },
};

/**
 * Tenants API
 */
export const tenantsApi = {
  getAll: async (): Promise<Tenant[]> => {
    await delay(MOCK_DELAY);
    return mockTenants;
  },

  getById: async (id: string): Promise<Tenant | null> => {
    await delay(MOCK_DELAY);
    return mockTenants.find(t => t.id === id) || null;
  },
};

/**
 * Users API
 */
export const usersApi = {
  getByTenant: async (
    tenantId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<User>> => {
    await delay(MOCK_DELAY);
    
    const filteredUsers = mockUsers.filter(u => u.tenantId === tenantId);
    const start = (page - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(start, start + pageSize);
    
    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredUsers.length / pageSize),
    };
  },

  getAll: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<User>> => {
    await delay(MOCK_DELAY);
    
    const start = (page - 1) * pageSize;
    const paginatedUsers = mockUsers.slice(start, start + pageSize);
    
    return {
      data: paginatedUsers,
      total: mockUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(mockUsers.length / pageSize),
    };
  },

  updateStatus: async (userId: string, status: User['status']): Promise<User> => {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user, status };
  },
};

/**
 * Dashboard Stats API
 */
export const dashboardApi = {
  getStats: async (tenantId: string): Promise<DashboardStats> => {
    await delay(MOCK_DELAY);
    
    const tenantUsers = mockUsers.filter(u => u.tenantId === tenantId);
    
    return {
      totalUsers: tenantUsers.length,
      activeUsers: tenantUsers.filter(u => u.status === 'active').length,
      pendingInvites: tenantUsers.filter(u => u.status === 'pending').length,
      storageUsed: Math.floor(Math.random() * 50) + 10,
      storageLimit: 100,
    };
  },

  getGlobalStats: async (): Promise<DashboardStats> => {
    await delay(MOCK_DELAY);
    
    return {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      pendingInvites: mockUsers.filter(u => u.status === 'pending').length,
      storageUsed: Math.floor(Math.random() * 200) + 50,
      storageLimit: 500,
    };
  },
};
