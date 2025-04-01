import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use the AuthContext
// Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
export const useAuth = () => {
  return useContext(AuthContext);
};

// Added import for prop-validation here
import PropTypes from 'prop-types';

export const AuthProvider = ({ children }) => {
  // State Management
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('authToken')
  );
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [userRole, setUserRole] = useState(
    localStorage.getItem('userRole') || ''
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // Function to log in the user
  const login = (userData, authToken) => {
    setIsLoggedIn(true);
    setToken(authToken); // Set the token in state
    setUser(userData); // Set the user data
    setUserRole(userData?.role || ''); // Set user role

    // Store data in localStorage for persistence
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData?.role || '');
  };

  // Function to log out the user
  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    setUserRole('');
    setCart([]);

    // Clear localStorage data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart');
  };

  // Function to manage cart
  const addToCart = (productId, quantity) => {
    const updatedCart = [...cart, { productId, quantity }];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Ensure token and user data persist after a page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // PropTypes validation for the AuthProvider component
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        userRole,
        cart,
        addToCart,
        logout,
        login,
        cartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
