import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/auth-context';
import type { Permission } from '../../auth/permissions';

interface ProtectedRouteProps {
  requiredPermission?: Permission;
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, can } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-900 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Restoring session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
