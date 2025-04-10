import * as PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useCart } from './providers/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const Card = ({ name, price, image, productId }) => {
  const { updateCartCount } = useCart();
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id;

    if (!token || !userId) {
      toast.warning('You need to log in to add items to the cart.');
      return;
    }

    try {
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
        toast.success('Product added to cart successfully!');
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?._id) {
          updateCartCount(user?._id);
        }
      } else {
        toast.error('Failed to add product to cart.');
      }
    } catch (error) {
      toast.error('Error adding product to cart. Please try again later.');
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className='max-w-[300px] relative flex flex-col items-center gap-2 mx-auto group'>
      {/* Cart Icon (Visible on Hover) */}
      <button
        onClick={handleAddToCart}
        className='absolute top-5 right-3 winter-carousel-button-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50'
        aria-label='Add to Cart'
      >
        <FaShoppingCart />
      </button>

      {/* Image Container with zoom effect */}
      <div className='relative overflow-hidden group'>
        <img
          src={image}
          alt={name}
          className='w-[300px] h-[400px] object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110'
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300')} // Fallback for broken images
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
};

export default Card;
