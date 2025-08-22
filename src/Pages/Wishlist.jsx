import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useWishlist } from '../Component/providers/WishlistContext';
import { useAuth } from '../Component/providers/AuthContext';
import { useCart } from '../Component/providers/CartContext';
import GuestWishlistService from '../services/GuestWishlistService';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist, fetchWishlist, wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchWishlist(user.id);
    }
  }, [isLoggedIn, user]);

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = async (product) => {
    const success = await addToCart({
      product_id: product.id,
      quantity: 1
    });

    if (success) {
      await removeFromWishlist(product.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Guest user case
  if (!isLoggedIn) {
    const guestWishlistIds = GuestWishlistService.getWishlist();
    
    if (guestWishlistIds.length === 0) {
      return (
        <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-gray-50">
          <div className="text-center px-4 max-w-md">
            <FiHeart className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Start adding products you love to keep track of them.
            </p>
            <div className="space-y-3">
              <Link
                to="/shop"
                className="block w-full sm:inline-block sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/login"
                className="block w-full sm:inline-block sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors sm:ml-4"
              >
                Login to Sync Wishlist
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 sm:pt-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist (Guest)</h1>
                <p className="text-gray-600 mt-1">
                  {guestWishlistIds.length} {guestWishlistIds.length === 1 ? 'item' : 'items'} saved locally
                </p>
              </div>
              <FiHeart className="h-8 w-8 text-red-500" />
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-3">
                <strong>Login to sync your wishlist</strong> across devices and see product details.
              </p>
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Login Now
              </Link>
            </div>
          </div>

          {/* Guest Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {guestWishlistIds.map((productId) => (
              <div key={productId} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Product ID: {productId}</p>
                    <p className="text-sm text-gray-500 mt-1">Login to see full details</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromWishlist(productId)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user with empty wishlist
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center px-4 max-w-md">
          <FiHeart className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Start adding products you love to keep track of them.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Logged-in user with wishlist items
  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <FiHeart className="h-8 w-8 text-red-500 mt-4 sm:mt-0" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src={item.products.image}
                  alt={item.products.product_name}
                  loading="lazy"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <Link
                  to={`/product/${item.products.id}`}
                  className="block text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2"
                >
                  {item.products.product_name}
                </Link>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.products.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-primary">
                    ₹{item.products.price}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.products.net_quantity}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  Added on {new Date(item.created_at).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item.products)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FiShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.products.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
