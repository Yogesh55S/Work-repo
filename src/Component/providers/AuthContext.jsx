import React, { createContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import GuestCartService from '../../services/GuestCartService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [cart, setCart] = useState([]);

  // Get cart context (note: this might cause a circular dependency issue -
  // make sure useCart is imported correctly or alternatively pass cartContext as a prop)
  const { transferGuestCartToUser } = useCart() || {};

  // Function to log in the user
  const login = async (userData, authToken) => {
    setIsLoggedIn(true);
    setToken(authToken);
    setUser(userData);
    setUserRole(userData?.role || '');

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData?.role || '');

    // Transfer guest cart to user account immediately
    const guestCart = GuestCartService.getCart();
    if (guestCart && guestCart.length > 0 && userData?._id) {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        // Directly call the merge endpoint without setTimeout
        await GuestCartService.transferCartToUser(
          userData._id,
          authToken,
          API_URL
        );

        // If transferGuestCartToUser callback exists, call it to update UI
        if (typeof transferGuestCartToUser === 'function') {
          await transferGuestCartToUser();
        }
      } catch (error) {
        console.error('Failed to transfer guest cart:', error);
      }
    }
  };

  // Function to log out the user
  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    setUserRole('');
    setCart([]);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart');
  };

  // Ensure token and user data persist after a page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setUserRole(storedUserRole);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        userRole,
        login,
        logout,
        cart,
        setCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
