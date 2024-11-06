import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    loading: true,
    error: null
  });

  // Función para verificar si el token está próximo a expirar
  const isTokenExpiringSoon = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // Renovar si faltan menos de 5 minutos para expirar
      return decoded.exp - currentTime < 300;
    } catch (error) {
      return false;
    }
  };

  // Configurar timer para verificar el token periódicamente
  useEffect(() => {
    let refreshTimer;

    const setupRefreshTimer = () => {
      if (authState.accessToken) {
        refreshTimer = setInterval(async () => {
          if (isTokenExpiringSoon(authState.accessToken)) {
            try {
              await refreshAccessToken();
            } catch (error) {
              console.error('Error al renovar el token:', error);
              // Si falla la renovación, hacer logout
              logout();
            }
          }
        }, 300000); // Verificar cada 5 minutos
      }
    };

    setupRefreshTimer();

    // Limpiar timer cuando el componente se desmonte
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [authState.accessToken]);

  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const expiresIn = localStorage.getItem('expiresIn');

      if (accessToken && refreshToken) {
        // Verificar si el token actual está expirado
        if (isTokenExpiringSoon(accessToken)) {
          // Intentar renovar inmediatamente
          refreshAccessToken().catch(() => {
            // Si falla la renovación, limpiar todo
            logout();
          });
        } else {
          setAxiosAuthHeader(accessToken);
          setAuthState(prev => ({
            ...prev,
            accessToken,
            refreshToken,
            expiresIn: parseInt(expiresIn),
            loading: false
          }));
        }
        
        setupAxiosInterceptors();
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const setAxiosAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const setupAxiosInterceptors = () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Verificar si es error de token y no es un reintento
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newTokens = await refreshAccessToken();
            if (newTokens) {
              // Actualizar el header de la petición original y reintentar
              originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Si falla la renovación, hacer logout
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_KEYCLOAK}/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: authState.refreshToken
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('expiresIn', expires_in);

      setAxiosAuthHeader(access_token);
      setAuthState(prev => ({
        ...prev,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in
      }));

      return response.data;
    } catch (error) {
      throw error;
    }
  };


  const login = async (username, password) => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_KEYCLOAK}/login`,
        new URLSearchParams({
          username,
          password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;

      // Guardar en localStorage
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('expiresIn', expires_in);

      // Actualizar estado y headers
      setAxiosAuthHeader(access_token);
      setAuthState(prev => ({
        ...prev,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in
      }));

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Error durante el inicio de sesión'
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    setAxiosAuthHeader(null);
    setAuthState({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      loading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        accessToken: authState.accessToken,
        loading: authState.loading,
        error: authState.error,
        login,
        logout,
        isAuthenticated: !!authState.accessToken
      }}
    >
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};