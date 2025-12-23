/**
 * Protected Route Component
 * 
 * Guards routes based on authentication and role-based permissions.
 * Architecture Decision: Route guards at the component level provide
 * declarative access control that's easy to understand and maintain.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { canAccessRoute } from '@/lib/permissions';
import { UserRole } from '@/types';
import { Loader2, ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: tenantLoading } = useTenant();
  const location = useLocation();

  // Show loading state while checking auth
  if (authLoading || tenantLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <UnauthorizedFallback />;
  }

  // Check route-based access
  if (!canAccessRoute(user.role, location.pathname)) {
    return <UnauthorizedFallback />;
  }

  return <>{children}</>;
};

const UnauthorizedFallback: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-foreground">
          Access Denied
        </h1>
        <p className="mb-6 text-muted-foreground">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};
