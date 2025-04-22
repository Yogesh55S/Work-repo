import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GuestCartService from '../../services/GuestCartService';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const updateCartCount = async (userId) => {
    setLoading(true);
    try {
      if (isLoggedIn && userId) {
        // For authenticated users - fetch from API
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const totalItems = data.cart.reduce(
            (total, item) => total + item.quantity,
            0
          );
          setCartCount(totalItems);
        }
      } else {
        // For guest users - get from localStorage
        const count = GuestCartService.getCartCount();
        setCartCount(count);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isLoggedIn && user?._id) {
        // For authenticated users
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/cart/${user._id}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id, quantity }),
        });

        if (response.ok) {
          await updateCartCount(user._id);
          return true;
        }
        return false;
      } else {
        // For guest users
        const success = GuestCartService.addToCart(product, quantity);
        if (success) {
          await updateCartCount(null);
        }
        return success;
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (userId, productId) => {
    try {
      if (isLoggedIn && userId) {
        // For authenticated users
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/cart/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          await updateCartCount(userId);
          return true;
        }
        return false;
      } else {
        // For guest users
        const success = GuestCartService.removeFromCart(productId);
        if (success) {
          await updateCartCount(null);
        }
        return success;
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      return false;
    }
  };

  const updateCartItemQuantity = async (userId, productId, quantity) => {
    try {
      if (isLoggedIn && userId) {
        // For authenticated users
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/cart/${userId}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
          await updateCartCount(userId);
          return true;
        }
        return false;
      } else {
        // For guest users
        const success = GuestCartService.updateQuantity(productId, quantity);
        if (success) {
          await updateCartCount(null);
        }
        return success;
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      return false;
    }
  };

  // Transfer guest cart to user account after login
  const transferGuestCartToUser = async () => {
    if (isLoggedIn && user?._id && GuestCartService.getCart().length > 0) {
      const token = localStorage.getItem('token');
      const success = await GuestCartService.transferCartToUser(
        user._id,
        token,
        API_URL
      );
      if (success) {
        await updateCartCount(user._id);
      }
      return success;
    }
    return false;
  };

  // Fetch cart data when authentication state changes
  useEffect(() => {
    const userId = user?._id;
    updateCartCount(userId);
  }, [isLoggedIn, user?._id]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateCartCount,
        updateCartItemQuantity,
        transferGuestCartToUser,
        cartItems,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
