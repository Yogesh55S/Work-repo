import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as PropTypes from 'prop-types';

import Card from '../Card';

const API_URL = import.meta.env.VITE_API_URL;

const OurProducts = ({ showAll, hideViewAllButton }) => {
  const [activeCategory, setActiveCategory] = useState('All'); // Keep active category state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To access the passed state (category)

  // Extract the category from location state (if any)
  const categoryFromState = location.state?.category || 'All'; // Default to "All" if category is not passed

  // Set the active category when coming from Care (via navigate)
  useEffect(() => {
    if (categoryFromState !== 'All') {
      setActiveCategory(categoryFromState); // Update active category if passed
    }
  }, [categoryFromState]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on the active category
  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter(
          (product) =>
            product.type?.trim().toLowerCase() ===
            activeCategory.trim().toLowerCase()
        );

  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 8);

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleViewAllClick = () => {
    navigate('/shop');
  };

  // Handle category button clicks
  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Set active category locally
  };

  return (
    <div className='p-4 bg-gray-50'>
      <div className='max-w-[1240px] mx-auto text-center'>
        <h2 className='text-3xl md:text-5xl tracking-wider text-[#5C3822] font-medium mb-4 xs:text-center'>
          Our Products
        </h2>
        <p className='text-sm sm:text-base text-gray-600 mb-8 xs:text-center'>
          Nurture your skin naturally with our herbal and homemade skincare
          essentials
        </p>

        {/* Category Buttons */}
        <div className='flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-8'>
          {['All', 'Body Care', 'Skin Care', 'Hair Care', 'Soap Bars'].map(
            (category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`product-button ${
                  activeCategory === category ? 'active' : ''
                }`}
              >
                <span>{category}</span>
              </button>
            )
          )}
        </div>

        {/* Loading and Error Handling */}
        {loading && <p className='text-gray-600'>Loading products...</p>}
        {error && <p className='text-red-600'>Error: {error}</p>}

        {/* Products Grid */}
        {!loading && !error && (
          <div className='grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {displayedProducts.length === 0 ? (
              <p className='text-gray-600'>
                No products found for this category.
              </p>
            ) : (
              displayedProducts.map((product) => {
                const baseUrl = API_URL.replace('/api', '');
                const imagePath = `${baseUrl}/${product.image.replace(
                  /\\/g,
                  '/'
                )}`;
                return (
                  <div
                    key={product._id}
                    className='cursor-pointer group transform transition duration-300 '
                    onClick={() => handleProductClick(product)}
                  >
                    <Card
                      name={product.productName}
                      price={`₹${product.price}`}
                      image={imagePath}
                      description={product.description}
                      productId={product._id}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* View All Button */}
        {!hideViewAllButton && (
          <div className='mt-8 xs:text-center'>
            <button onClick={handleViewAllClick} className='brown-deep-button'>
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

OurProducts.propTypes = {
  showAll: PropTypes.bool,
  hideViewAllButton: PropTypes.bool,
};

export default OurProducts;
