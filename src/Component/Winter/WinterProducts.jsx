import React, { useState, useEffect } from "react";
import Card from "../Card";

const WinterProducts = () => {
  const [winterProducts, setWinterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL; // Backend URL from .env

  useEffect(() => {
    const fetchWinterProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();

        // Filter products with subType "Winter Collection"
        const filteredProducts = data.filter(product => product.subType === "Winter Collection");

        setWinterProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching winter products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWinterProducts();
  }, [API_URL]);

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-[1240px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Winter Collection</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Discover our exclusive winter collection, designed to keep your skin and body healthy and nourished during the cold months.
        </p>

        {loading && <p className="text-gray-600">Loading products...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <>
            {winterProducts.length === 0 ? (
              <p className="text-gray-600">No products found for the Winter Collection.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {winterProducts.map(product => {
                  const baseUrl = API_URL.replace('/api', '');
                  const imagePath = `${baseUrl}/${product.image.replace(/\\/g, '/')}`;
                  return (
                    <div key={product._id} className="cursor-pointer group">
                      <Card 
                        name={product.productName} 
                        price={`₹${product.price}`} 
                        image={imagePath}
                        description={product.description} 
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WinterProducts;
