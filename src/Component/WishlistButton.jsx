import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from './providers/WishlistContext';
import { useAuth } from './providers/AuthContext';

const WishlistButton = ({ productId, className = "" }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist: checkWishlist } = useWishlist();
  const { isLoggedIn, user } = useAuth();

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isLoggedIn && user?.id) {
        const inWishlist = await checkWishlist(productId);
        setIsInWishlist(inWishlist);
      }
    };

    checkWishlistStatus();
  }, [productId, isLoggedIn, user, checkWishlist]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('Please login to add items to your wishlist');
      return;
    }

    setLoading(true);
    
    try {
      if (isInWishlist) {
        const success = await removeFromWishlist(productId);
        if (success) {
          setIsInWishlist(false);
        }
      } else {
        const success = await addToWishlist(productId);
        if (success) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={loading}
      className={`
        relative p-2 rounded-full transition-all duration-300 hover:bg-gray-100
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? (
        <FaHeart className="w-5 h-5 text-red-500" />
      ) : (
        <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

export default WishlistButton;
