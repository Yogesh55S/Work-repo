import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Card from "./Card"; // Ensure the Card component is imported correctly

const API_URL = import.meta.env.VITE_API_URL;

const RelatedProducts = ({ productType }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

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
        const filtered = data
          .filter((item) => item.type?.trim().toLowerCase() === productType.trim().toLowerCase())
          .slice(0, 4); // Restrict to 4 items

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

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-lg mb-4">Related Products</h3>
      {loading && <p className="text-gray-600">Loading related products...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && relatedProducts.length === 0 && (
        <p className="text-gray-600">No related products found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {relatedProducts.map((item) => {
          const baseUrl = API_URL.replace("/api", "");
          const imagePath = `${baseUrl}/${item.image.replace(/\\/g, "/")}`;
          return (
            <Card
              key={item._id}
              name={item.productName}
              price={`₹${item.price}`}
              image={imagePath}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
};

// Add prop types for validation
RelatedProducts.propTypes = {
  productType: PropTypes.string.isRequired, // productType should be a string and is required
};

export default RelatedProducts;
