import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as PropTypes from 'prop-types';

import Card from './Card';

const API_URL = import.meta.env.VITE_API_URL;

const RelatedProducts = ({ productType }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRelatedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch related products: ${response.statusText}`
        );
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        const filtered = data.filter(
          (item) =>
            item.type?.trim().toLowerCase() === productType.trim().toLowerCase()
        );
        setRelatedProducts(filtered);
      } else {
        throw new Error('Invalid data format received from the API.');
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
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
    window.scrollTo(0, 0); // Scroll to top before navigating
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className='mt-16  border-t pt-8'>
      <h3 className='text-lg mb-4'>You might also like</h3>
      {loading && <p className='text-gray-600'>Loading related products...</p>}
      {error && <p className='text-red-600'>Error: {error}</p>}
      {!loading && !error && relatedProducts.length === 0 && (
        <p className='text-gray-600'>No related products found.</p>
      )}

      <div className='relative'>
        <div
          className='flex overflow-x-auto snap-x snap-mandatory gap-6 px-6'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {relatedProducts.map((item) => {
            return (
              <div
                className='min-w-[300px] max-w-[300px] h-[500px] flex-shrink-0 snap-start transform transition  cursor-pointer'
                key={item._id}
                onClick={() => handleProductClick(item)}
              >
                <Card
                  name={item.productName}
                  price={`₹${item.price}`}
                  image={item.image}
                  productId={item._id} // Use item._id here instead of product._id
                />
              </div>
            );
          })}
        </div>
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

RelatedProducts.propTypes = {
  productType: PropTypes.string.isRequired,
};

export default RelatedProducts;
