import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        const totalItems = data.cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const removeFromCart = async (userId, productId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ productId }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.cartCount); // Directly update cart count from response
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{ cartCount, updateCartCount, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
