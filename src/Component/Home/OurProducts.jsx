import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes for validation
import Card from "../Card";

// For fetching products
const API_URL = import.meta.env.VITE_API_URL; // Use environment variable for API URL

const OurProducts = ({ showAll, hideViewAllButton }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Products:", data); // Log to check the categories
        setProducts(data); // Set fetched products in state
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  // Log active category to check if it's updating correctly
  console.log("Active Category:", activeCategory);

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) =>
          product.type && product.type.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );

  // Display limited products if `showAll` is false
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 8);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleViewAllClick = () => {
    navigate("/shop"); // Redirect to shop page
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-[1240px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Products</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-8">
          {["All", "Body Care", "Skin Care", "Hair Care", "Soap Bars"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 sm:px-4 py-2 border font-medium mb-2 ${
                activeCategory === category
                  ? "bg-button-primary text-white"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-primary hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading and Error Handling */}
        {loading && <p className="text-gray-600">Loading products...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.length === 0 ? (
              <p className="text-gray-600">No products found for this category.</p>
            ) : (
              displayedProducts.map((product) => {
                const baseUrl = API_URL.replace('/api', '');
                const imagePath = `${baseUrl}/${product.image.replace(/\\/g, '/')}`;
                return (
                  <div
                    key={product._id}
                    className="cursor-pointer group"
                    onClick={() => handleProductClick(product)}
                  >
                    <Card
                      name={product.productName}
                      price={`₹${product.price}`}
                      image={imagePath}
                      description={product.description}
                    />
                    <style jsx>{`
                      .group:hover img {
                        transform: scale(1.05);
                        transition: transform 0.3s ease;
                      }
                    `}</style>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* View All Button */}
        {!hideViewAllButton && (
          <div className="mt-8">
            <button
              onClick={handleViewAllClick}
              className="px-6 py-2 bg-button-primary text-white text-lg shadow hover:bg-primary transition"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Prop validation with PropTypes
OurProducts.propTypes = {
  showAll: PropTypes.bool,              // Expected type is boolean
  hideViewAllButton: PropTypes.bool,    // Expected type is boolean
};

export default OurProducts;
