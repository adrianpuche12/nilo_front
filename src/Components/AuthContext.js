import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setAxiosAuthHeader(storedToken);
        setAuthToken(storedToken);
      }
      setLoading(false);
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

  const login = async (username, password) => {
    try {
      setError(null);
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

      const { access_token } = response.data;
      setAxiosAuthHeader(access_token);
      setAuthToken(access_token);
      localStorage.setItem('accessToken', access_token);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Error durante el inicio de sesión');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAxiosAuthHeader(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authToken, 
        login, 
        logout, 
        loading, 
        error,
        isAuthenticated: !!authToken 
      }}
    >
      {!loading && children}
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