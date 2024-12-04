import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // No hagas nada hasta que se complete la carga

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (roles.includes('admin')) {
      const adminAllowedRoutes = [
        '/admin/adminhome',
        '/countries',
        '/province',
        '/activities',
        '/users',
        '/cities',
        '/itineraries',
        '/profile',
      ];

      if (!isRouteAllowed(location.pathname, adminAllowedRoutes)) {
        navigate('/admin/adminhome', { replace: true });
      }
    }
    // No es necesario actualizar `isVerified` aquí, porque `children` será mostrado automáticamente
  }, [isAuthenticated, roles, loading, navigate, location.pathname]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return children;
};

const isRouteAllowed = (path, allowedRoutes) => {
  return (
    allowedRoutes.includes(path) || matchPath('/user/:id', path)
  );
};
