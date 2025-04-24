import * as PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useCart } from './providers/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from './providers/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestCartService from '../services/GuestCartService';

const Card = ({ name, price, image, productId, product }) => {
  const { updateCartCount } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple clicks

    try {
      setIsAddingToCart(true);

      // Show loading toast for better UX
      const toastId = toast.loading('Adding to cart...');

      if (isLoggedIn && user?._id) {
        // For logged-in users - direct API call
        const token = localStorage.getItem('token');
        const userId = user._id;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/cart/${userId}/add`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, quantity: 1 }),
          }
        );

        if (response.ok) {
          // Update cart count separately
          updateCartCount(userId);
          toast.update(toastId, {
            render: 'Product added to cart successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          throw new Error('Failed to add product to cart');
        }
      } else {
        // For guest users - use localStorage
        const productToAdd = product || {
          _id: productId,
          productName: name,
          price: parseFloat(price.replace('₹', '')),
          image: image, // Store the complete Cloudinary URL
        };

        const success = GuestCartService.addToCart(productToAdd, 1);

        if (success) {
          updateCartCount();
          toast.update(toastId, {
            render: 'Product added to cart successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          throw new Error('Failed to add product to cart');
        }
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Error adding product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle click on the card to navigate to product detail
  const handleCardClick = () => {
    navigate(`/product/${productId}`, { state: { product } });
  };

  return (
    <div
      className='max-w-[300px] relative flex flex-col items-center gap-2 mx-auto group cursor-pointer'
      onClick={handleCardClick}
    >
      {/* Cart Icon (Visible on Hover) */}
      <button
        onClick={handleAddToCart} // No stopPropagation here
        disabled={isAddingToCart}
        className={`absolute top-5 right-3 winter-carousel-button-2 ${
          isAddingToCart ? 'opacity-75' : 'opacity-0'
        } group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50`}
        aria-label='Add to Cart'
      >
        {isAddingToCart ? '...' : <FaShoppingCart />}
      </button>

      {/* Image Container with zoom effect */}
      <div className='relative overflow-hidden group'>
        <img
          src={image}
          alt={name}
          className='w-[300px] h-[400px] object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110'
          // Fallback for broken images
        />
      </div>

      <div className='text-center mt-4 mx-auto'>
        <h3
          className='text-sm font-medium text-gray-800 truncate w-full'
          title={name}
        >
          {name}
        </h3>
        <p
          className='text-gray-600 font-semibold'
          style={{ textAlign: 'center' }}
        >
          {price}
        </p>
      </div>
    </div>
  );
};

// Prop types validation
Card.propTypes = {
  name: PropTypes.string.isRequired, // Ensures 'name' is a required string
  price: PropTypes.string.isRequired, // Ensures 'price' is a required string
  image: PropTypes.string.isRequired, // Ensures 'image' is a required string
  productId: PropTypes.string.isRequired, // Product ID for the cart action
  product: PropTypes.object, // Full product object if available
};

export default Card;
