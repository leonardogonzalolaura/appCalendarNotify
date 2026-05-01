import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const mockUser = { email, name: email.split('@')[0], photo: null };
    setUser(mockUser);
    localStorage.setItem('app_user', JSON.stringify(mockUser));
    return true;
  };

  const loginWithGoogle = () => {
    // Mock Google login
    const mockUser = { 
      email: 'user@gmail.com', 
      name: 'Google User', 
      photo: 'https://lh3.googleusercontent.com/a/default-user' 
    };
    setUser(mockUser);
    localStorage.setItem('app_user', JSON.stringify(mockUser));
    return true;
  };

  const signup = (userData) => {
    // Mock signup logic
    const newUser = { ...userData, photo: null };
    setUser(newUser);
    localStorage.setItem('app_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
