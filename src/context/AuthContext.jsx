import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('app_user');
      const token = localStorage.getItem('app_token');
      
      if (savedUser && token) {
        try {
          // Verify token by fetching settings
          await api.getSettings();
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Session validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await api.login(email, password);
      setUser(user);
      localStorage.setItem('app_user', JSON.stringify(user));
      localStorage.setItem('app_token', token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const { token, user } = await api.googleLogin(credential);
      setUser(user);
      localStorage.setItem('app_user', JSON.stringify(user));
      localStorage.setItem('app_token', token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const { token, user } = await api.signup(userData);
      setUser(user);
      localStorage.setItem('app_user', JSON.stringify(user));
      localStorage.setItem('app_token', token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
