import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false); // Nuevo estado para controlar el renderizado

  useEffect(() => {
    if (loading) return; // No hacer nada mientras se cargan los datos

    if (!isAuthenticated) {
      // Si no está autenticado, redirige al login
      navigate('/login', { replace: true });
    } else if (roles.includes('admin')) {
      // Si es administrador, verifica si está en una ruta permitida
      const adminAllowedRoutes = [
        '/admin/adminhome',
        '/countries',
        '/province',
        '/activities',
        '/users',
        '/cities',
        '/itineraries',
      ];

      if (!adminAllowedRoutes.includes(location.pathname)) {
        // Redirige directamente a /admin/adminhome
        navigate('/admin/adminhome', { replace: true });
      } else {
        setIsVerified(true); // Marca como verificado si está en una ruta permitida
      }
    } else {
      setIsVerified(true); // Para usuarios no administradores, permite el acceso a rutas normales
    }
  }, [isAuthenticated, roles, loading, navigate, location.pathname]);

  if (loading || !isVerified) {
    // Mientras se verifica la autenticación o la ruta, muestra una pantalla de carga
    return <div>Cargando...</div>;
  }

  return children; // Renderiza los hijos solo cuando todo está verificado
};
