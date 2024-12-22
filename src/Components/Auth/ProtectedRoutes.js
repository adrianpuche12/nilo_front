import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRouteValidated, setIsRouteValidated] = useState(false); 

  useEffect(() => {
    if (loading) return; // No hacer nada mientras se cargan los datos

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
        '/userReservations',
        '/user-registration',
        '/Historia'
      ];

      if (!isRouteAllowed(location.pathname, adminAllowedRoutes)) {
        navigate('/admin/adminhome', { replace: true });
        return; 
      }
    }

    setIsRouteValidated(true); 
  }, [isAuthenticated, roles, loading, navigate, location.pathname]);

  if (loading || !isRouteValidated) {
    // Mostrar un indicador de carga mientras se valida la ruta
    return <div>Cargando...</div>;
  }

  return children; // Renderiza los hijos solo si la validación está completa
};

const isRouteAllowed = (path, allowedRoutes) => {
  return (
    allowedRoutes.includes(path) || matchPath('/user/:id', path)
  );
};
