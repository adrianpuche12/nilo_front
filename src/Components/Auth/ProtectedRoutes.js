import { useNavigate, useLocation } from 'react-router-dom'; 
import { useAuth } from './AuthContext'; 
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const navigate = useNavigate();  
  const location = useLocation(); // Para obtener la ruta actual

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      // Redirige a login si no está autenticado
      navigate('/login', { replace: true });
    } else if (roles.includes('admin')) {
      // Permitir a admin acceder a...
      const adminAllowedRoutes = ['/admin/adminhome', '/countries', '/province', '/activities', '/users', '/cities', '/itineraries'];

      if (!adminAllowedRoutes.includes(location.pathname)) {
        // Redirige a /admin/adminhome si está en una ruta no permitida
        navigate('/admin/adminhome', { replace: true });
      }
    }
  }, [isAuthenticated, roles, loading, navigate, location.pathname]); // Incluimos location.pathname para detectar cambios de ruta

  if (loading) {
    return <div>Cargando...</div>;
  }

    return children;
};
