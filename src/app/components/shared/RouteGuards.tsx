import { Navigate } from 'react-router';
import authService from '../../services/authService';

// Protege rutas que solo puede ver el ADMIN
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const roles: string[] = user.roles || [];
  if (!roles.includes('ADMIN')) {
    // Usuario logueado pero sin rol ADMIN → lo mandamos al catálogo (su lugar)
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
}

// Protege rutas que NO puede ver un ADMIN (como catálogo, carrito, etc.)
export function ClientRoute({ children }: { children: React.ReactNode }) {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const roles: string[] = user.roles || [];
  if (roles.includes('ADMIN')) {
    // Admin intenta acceder a rutas de clientes → forzar al dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
