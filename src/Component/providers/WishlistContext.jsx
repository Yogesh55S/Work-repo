import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import GuestWishlistService from '../../services/GuestWishlistService';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Update guest wishlist count
  const updateGuestWishlistCount = () => {
    const count = GuestWishlistService.getWishlistCount();
    setWishlistCount(count);
  };

  // Fetch user's wishlist from server
  const fetchWishlist = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/wishlist/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWishlistItems(data.data);
        setWishlistCount(data.data.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (isLoggedIn && user?.id) {
      // Logged-in user
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: productId
          })
        });

        const data = await response.json();
        
        if (data.success) {
          await fetchWishlist(user.id);
          return true;
        } else if (response.status === 409) {
          alert('Product already in wishlist');
          return false;
        } else {
          alert(data.message || 'Failed to add to wishlist');
          return false;
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        alert('Failed to add to wishlist');
        return false;
      }
    } else {
      // Guest user
      const success = GuestWishlistService.addToWishlist(productId);
      if (success) {
        updateGuestWishlistCount();
        return true;
      } else {
        alert('Product already in wishlist');
        return false;
      }
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (isLoggedIn && user?.id) {
      // Logged-in user
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: productId
          })
        });

        const data = await response.json();
        
        if (data.success) {
          await fetchWishlist(user.id);
          return true;
        } else {
          alert(data.message || 'Failed to remove from wishlist');
          return false;
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        alert('Failed to remove from wishlist');
        return false;
      }
    } else {
      // Guest user
      const success = GuestWishlistService.removeFromWishlist(productId);
      if (success) {
        updateGuestWishlistCount();
        return true;
      }
      return false;
    }
  };

  // Check if item is in wishlist
  const isInWishlist = async (productId) => {
    if (isLoggedIn && user?.id) {
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist/check/${user.id}/${productId}`);
        const data = await response.json();
        return data.success ? data.isInWishlist : false;
      } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
      }
    } else {
      return GuestWishlistService.isInWishlist(productId);
    }
  };

  // Initialize wishlist based on user state
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchWishlist(user.id);
    } else {
      setWishlistItems([]);
      updateGuestWishlistCount();
    }
  }, [isLoggedIn, user]);

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    updateGuestWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
