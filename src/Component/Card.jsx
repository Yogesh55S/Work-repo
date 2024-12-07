import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { FaShoppingCart } from "react-icons/fa"; // Cart Icon

const Card = ({ name, price, image, productId, onAddToCart }) => {
  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(productId);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-2 group">
      {/* Cart Icon */}
      <button
        onClick={handleAddToCartClick}
        className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50"
        aria-label="Add to Cart"
      >
        <FaShoppingCart />
      </button>

      {/* Image Container with zoom effect */}
      <div className="relative overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-[300px] h-[400px] object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")} // Fallback for broken images
        />
      </div>

      <div className="text-center mt-4 px-2">
        <h3
          className="text-sm font-medium text-gray-800 truncate w-full"
          title={name} // Tooltip to show the full name
        >
          {name}
        </h3>
        <p className="text-gray-600 font-semibold">{price}</p>
      </div>
    </div>
  );
};

// Prop types validation
Card.propTypes = {
  name: PropTypes.string.isRequired,  // Ensures 'name' is a required string
  price: PropTypes.string.isRequired, // Ensures 'price' is a required string
  image: PropTypes.string.isRequired, // Ensures 'image' is a required string
  productId: PropTypes.string.isRequired, // Product ID for the cart action
  onAddToCart: PropTypes.func.isRequired, // Function to handle add to cart
};

export default Card;
