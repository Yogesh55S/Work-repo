// providers/CartContext.jsx - Enhanced version
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import GuestCartService from "../../services/GuestCartService";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCart = useCallback(
    async (userId) => {
      if (!userId || !isLoggedIn) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cartItems || []);
          setCartCount(data.itemCount || 0);
        } else {
          console.error('Failed to fetch cart from database');
          setCartItems([]);
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, API_URL]
  );

  // FIXED: Enhanced updateCartCount function
  const updateCartCount = useCallback(
    async (userId) => {
      try {
        if (isLoggedIn && userId) {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/cart/${userId}/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCartCount(data.count || 0);
          } else {
            console.error('Failed to fetch cart count from API');
            setCartCount(0);
          }
        } else {
          // For guest users, get count from localStorage
          const guestCount = GuestCartService.getCartCount();
          setCartCount(guestCount);
        }
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        if (!isLoggedIn) {
          // Fallback to guest cart count
          const guestCount = GuestCartService.getCartCount();
          setCartCount(guestCount);
        } else {
          setCartCount(0);
        }
      }
    },
    [isLoggedIn, API_URL]
  );

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isLoggedIn && user?.id) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/cart/${user.id}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id || product.id,
            quantity
          }),
        });

        if (response.ok) {
          // Refresh both cart items and count
          await fetchCart(user.id);
          await updateCartCount(user.id);
          return true;
        } else {
          const errorData = await response.json();
          console.error('Database add to cart error:', errorData);
          return false;
        }
      } else {
        const success = GuestCartService.addToCart(product, quantity);
        if (success) {
          // Update guest cart count
          await updateCartCount(null);
        }
        return success;
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return false;
    }
  };

  const removeFromCart = async (userId, productId) => {
    try {
      if (isLoggedIn && userId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/cart/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          // Refresh both cart items and count
          await fetchCart(userId);
          await updateCartCount(userId);
          return true;
        }
        return false;
      } else {
        const success = GuestCartService.removeFromCart(productId);
        if (success) {
          // Update guest cart count
          await updateCartCount(null);
        }
        return success;
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      return false;
    }
  };

  const updateCartItemQuantity = async (userId, productId, quantity) => {
    try {
      if (isLoggedIn && userId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/cart/${userId}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
          // Refresh both cart items and count
          await fetchCart(userId);
          await updateCartCount(userId);
          return true;
        }
        return false;
      } else {
        const success = GuestCartService.updateQuantity(productId, quantity);
        if (success) {
          // Update guest cart count
          await updateCartCount(null);
        }
        return success;
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      return false;
    }
  };

  // Load cart when user state changes
  useEffect(() => {
    const userId = user?.id;
    if (isLoggedIn && userId) {
      fetchCart(userId);
      updateCartCount(userId);
    } else if (!isLoggedIn) {
      // For guest users, get from localStorage
      const localCart = GuestCartService.getCart();
      setCartItems(localCart);
      const guestCount = GuestCartService.getCartCount();
      setCartCount(guestCount);
    }
  }, [isLoggedIn, user?.id, fetchCart, updateCartCount]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateCartCount,
        fetchCart,
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
