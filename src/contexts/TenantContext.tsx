/**
 * Tenant Context
 * 
 * Manages the current tenant state and available tenants for super admins.
 * Architecture Decision: Separating tenant state from auth state keeps concerns
 * clean and allows independent updates (e.g., tenant switching without re-auth).
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Tenant, TenantState } from '@/types';
import { tenantsApi } from '@/lib/mock-api';
import { useAuth } from './AuthContext';

interface TenantContextValue extends TenantState {
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

const TENANT_STORAGE_KEY = 'dashboard_tenant';

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<TenantState>({
    currentTenant: null,
    availableTenants: [],
    isLoading: true,
  });

  // Load tenants when user authenticates
  useEffect(() => {
    const loadTenants = async () => {
      if (!isAuthenticated || !user) {
        setState({
          currentTenant: null,
          availableTenants: [],
          isLoading: false,
        });
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const tenants = await tenantsApi.getAll();
        
        // Restore or set current tenant
        let currentTenant: Tenant | null = null;
        const storedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);
        
        if (user.role === 'super_admin') {
          // Super admin can switch tenants
          currentTenant = storedTenantId 
            ? tenants.find(t => t.id === storedTenantId) || tenants[0]
            : tenants[0];
        } else {
          // Other roles are locked to their tenant
          currentTenant = tenants.find(t => t.id === user.tenantId) || null;
        }
        
        if (currentTenant) {
          localStorage.setItem(TENANT_STORAGE_KEY, currentTenant.id);
        }
        
        setState({
          currentTenant,
          availableTenants: user.role === 'super_admin' ? tenants : [],
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load tenants:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadTenants();
  }, [isAuthenticated, user]);

  const switchTenant = useCallback(async (tenantId: string) => {
    if (!user || user.role !== 'super_admin') {
      throw new Error('Only super admins can switch tenants');
    }

    const tenant = state.availableTenants.find(t => t.id === tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
    setState(prev => ({ ...prev, currentTenant: tenant }));
  }, [user, state.availableTenants]);

  const refreshTenants = useCallback(async () => {
    const tenants = await tenantsApi.getAll();
    setState(prev => ({
      ...prev,
      availableTenants: tenants,
    }));
  }, []);

  return (
    <TenantContext.Provider value={{ ...state, switchTenant, refreshTenants }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextValue => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
