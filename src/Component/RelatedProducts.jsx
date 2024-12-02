import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import PropTypes from "prop-types"; // Import PropTypes
import Card from "./Card"; // Ensure the Card component is imported correctly

const API_URL = import.meta.env.VITE_API_URL;

const RelatedProducts = ({ productType }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Initialize navigation

  const fetchRelatedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch related products: ${response.statusText}`);
      }
      const data = await response.json();

      // Ensure the data is an array and filter products by type
      if (Array.isArray(data)) {
        const filtered = data.filter(
          (item) => item.type?.trim().toLowerCase() === productType.trim().toLowerCase()
        );

        setRelatedProducts(filtered);
      } else {
        throw new Error("Invalid data format received from the API.");
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productType]);

  useEffect(() => {
    if (productType) {
      fetchRelatedProducts();
    }
  }, [productType, fetchRelatedProducts]);

  const handleProductClick = (product) => {
    // Scroll to the top of the page before navigating
    window.scrollTo(0, 0);  // This will scroll to the top of the page
    
    // Navigate to the product details page with the product's ID
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-lg mb-4">You might also like</h3>
      {loading && <p className="text-gray-600">Loading related products...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && relatedProducts.length === 0 && (
        <p className="text-gray-600">No related products found.</p>
      )}

      <div className="relative">
        {/* Inline styles for hiding scrollbars */}
        <div
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {relatedProducts.map((item) => {
            const baseUrl = API_URL.replace("/api", "");
            const imagePath = `${baseUrl}/${item.image.replace(/\\/g, "/")}`;
            return (
              <div
                className="min-w-[240px] max-w-[240px] flex-shrink-0 snap-start transform transition duration-300 hover:scale-105 cursor-pointer"
                key={item._id}
                onClick={() => handleProductClick(item)} // Navigate on click
              >
                <Card
                  name={item.productName}
                  price={`₹${item.price}`}
                  image={imagePath}
                  description={item.description}
                />
              </div>
            );
          })}
        </div>
        {/* Additional style for hiding scrollbar in WebKit-based browsers */}
        <style>
          {`
            .flex::-webkit-scrollbar {
              display: none; /* For Chrome, Safari, and Opera */
            }
          `}
        </style>
      </div>
    </div>
  );
};

// Add prop types for validation
RelatedProducts.propTypes = {
  productType: PropTypes.string.isRequired, // productType should be a string and is required
};

export default RelatedProducts;
