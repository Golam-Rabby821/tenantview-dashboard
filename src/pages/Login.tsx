/**
 * Login Page
 * 
 * Mock authentication page allowing role and tenant selection.
 * Architecture Note: This simulates auth flow - in production, replace
 * with actual auth provider integration (Auth0, Clerk, Supabase, etc.)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { tenantsApi } from '@/lib/mock-api';
import { Tenant, UserRole } from '@/types';
import { getRoleDisplayName } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const roles: UserRole[] = ['super_admin', 'org_admin', 'member'];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('org_admin');
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [tenantsLoading, setTenantsLoading] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load tenants on mount
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await tenantsApi.getAll();
        setTenants(data);
        if (data.length > 0) {
          setSelectedTenant(data[0].id);
        }
      } catch (error) {
        console.error('Failed to load tenants:', error);
      } finally {
        setTenantsLoading(false);
      }
    };
    loadTenants();
  }, []);

  const handleLogin = async () => {
    if (!selectedTenant) {
      toast({
        title: 'Please select a tenant',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(selectedRole, selectedTenant);
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${getRoleDisplayName(selectedRole)}`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar items-center justify-center p-12">
        <div className="max-w-md text-center animate-fade-in">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sidebar-primary">
              <Shield className="h-10 w-10 text-sidebar-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
            AdminHub
          </h1>
          <p className="text-lg text-sidebar-muted">
            Enterprise-grade multi-tenant dashboard for modern teams.
            Manage users, organizations, and settings with confidence.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-in">
          {/* Mobile Logo */}
          <div className="mb-8 flex lg:hidden justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-muted-foreground">
              Select your role and organization to continue
            </p>
          </div>

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {selectedRole === 'super_admin' &&
                  'Full access to all tenants and settings'}
                {selectedRole === 'org_admin' &&
                  'Manage users and settings within your organization'}
                {selectedRole === 'member' && 'Read-only access to dashboard'}
              </p>
            </div>

            {/* Tenant Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Organization
              </label>
              <Select
                value={selectedTenant}
                onValueChange={setSelectedTenant}
                disabled={tenantsLoading}
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={
                      tenantsLoading ? 'Loading...' : 'Select an organization'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || tenantsLoading || !selectedTenant}
              className="w-full h-12 text-base font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Demo Mode:</strong> This is a
              mock authentication flow. In production, integrate with your
              preferred auth provider (Auth0, Clerk, Supabase, etc.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
