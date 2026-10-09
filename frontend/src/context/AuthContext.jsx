import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('teamforge_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('teamforge_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.success) {
            setUser(response.data);
            localStorage.setItem('teamforge_user', JSON.stringify(response.data));
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success) {
      const { token, ...userData } = response.data;
      localStorage.setItem('teamforge_token', token);
      localStorage.setItem('teamforge_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const register = async (registerData) => {
    const response = await api.post('/auth/register', registerData);
    if (response.success) {
      const { token, ...userData } = response.data;
      localStorage.setItem('teamforge_token', token);
      localStorage.setItem('teamforge_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const logout = () => {
    localStorage.removeItem('teamforge_token');
    localStorage.removeItem('teamforge_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
