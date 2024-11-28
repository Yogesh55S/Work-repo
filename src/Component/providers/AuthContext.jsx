import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// This will hold the authentication state and the user role
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user with role
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    console.log('Auth state changed. Current user:', user);
  }, [user]);

  const isLoggedIn = !!user;

  // Pass the user, role and loggedIn state to the context value
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, userRole: user?.role || '' }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access Auth context
export const useAuth = () => useContext(AuthContext);
