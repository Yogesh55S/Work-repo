import React from "react";
import * as PropTypes from "prop-types";


import { FaShoppingCart } from "react-icons/fa";

const Card = ({ name, price, image, productId }) => {
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userId = user?._id;

    if (!token || !userId) {
      alert("You need to log in to add items to the cart.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }), // Corrected to use productId
      });

      if (response.ok) {
        const updatedCart = await response.json();
        console.log("Item added to cart:", updatedCart);
        alert("Product added to cart successfully!");
      } else {
        console.error("Failed to add item to cart. Status:", response.status);
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert("An error occurred while adding the product to the cart.");
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-2 group">
      {/* Cart Icon (Visible on Hover) */}
      <button
        onClick={handleAddToCart}
        className="absolute top-5 right-3 winter-carousel-button-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50"
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
  name: PropTypes.string.isRequired, // Ensures 'name' is a required string
  price: PropTypes.string.isRequired, // Ensures 'price' is a required string
  image: PropTypes.string.isRequired, // Ensures 'image' is a required string
  productId: PropTypes.string.isRequired, // Product ID for the cart action
};

export default Card;
