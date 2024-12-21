import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    roles: [],
    userName: null,
    userId: null, 
    loading: true,
    error: null,
  });

  // Verificar si el token está próximo a expirar
  const isTokenExpiringSoon = (token) => {
    if (!token) return true; // Sin token, asumimos expiración
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp - currentTime < 300; // Menos de 5 minutos
    } catch {
      return true; // Si falla, asumimos expiración
    }
  };

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

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newTokens = await refreshAccessToken();
            if (newTokens) {
              originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
              return axios(originalRequest);
            }
          } catch {
            logout();
            return Promise.reject(error);
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
          refresh_token: authState.refreshToken,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token, refresh_token, expires_in } = response.data;

      const { userName, userId } = decodeUserDetails(access_token); // Obtener userName e userId

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('expiresIn', expires_in);
      localStorage.setItem('userId', userId); // Guardar el ID del usuario

      setAxiosAuthHeader(access_token);
      setAuthState((prev) => ({
        ...prev,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        roles: decodeRoles(access_token),
        userName,
        userId, // Establecer el userId
      }));

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Función para decodificar roles
  const decodeRoles = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.realm_access?.roles || [];
    } catch {
      return [];
    }
  };

  // Función para decodificar el nombre de usuario y el ID del usuario
  const decodeUserDetails = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        userName: decoded.preferred_username || decoded.name || decoded.sub || "Usuario desconocido",
        userId: decoded.sub || null, // Obtener el ID del usuario en el JWT
      };
    } catch {
      return { userName: "Usuario desconocido", userId: null };
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const expiresIn = localStorage.getItem('expiresIn');
      const userId = localStorage.getItem('userId'); // Recuperar el ID del usuario

      if (accessToken && refreshToken) {
        if (isTokenExpiringSoon(accessToken)) {
          refreshAccessToken().catch(logout);
        } else {
          const roles = decodeRoles(accessToken);
          const userName = decodeUserDetails(accessToken).userName;
          setAxiosAuthHeader(accessToken);
          setAuthState({
            accessToken,
            refreshToken,
            expiresIn: parseInt(expiresIn, 10),
            roles,
            userName,
            userId, // Establecer el userId
            loading: false,
            error: null,
          });
        }
        setupAxiosInterceptors();
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_KEYCLOAK}/login`,
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token, refresh_token, expires_in } = response.data;

      const { userName, userId } = decodeUserDetails(access_token); // Obtener userName e userId

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('expiresIn', expires_in);
      localStorage.setItem('userId', userId); // Guardar el ID del usuario

      setAxiosAuthHeader(access_token);
      setAuthState({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        roles: decodeRoles(access_token),
        userName,
        userId, // Establecer el userId
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: error.response?.data?.message || 'Error durante el inicio de sesión',
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId'); // Eliminar el ID del usuario
    setAxiosAuthHeader(null);
    setAuthState({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      roles: [],
      userName: null,
      userId: null, // Restablecer el userId
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: authState.accessToken,
        roles: authState.roles,
        userName: authState.userName,
        userId: authState.userId, // Exponer el userId
        loading: authState.loading,
        error: authState.error,
        login,
        logout,
        isAuthenticated: !!authState.accessToken,
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
