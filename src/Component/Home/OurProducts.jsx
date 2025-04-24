import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import Card from '../Card';
import CardSkeleton from '../skeletons/Cardskeleton';

const API_URL = import.meta.env.VITE_API_URL;

const OurProducts = ({ showAll, hideViewAllButton }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardsToShow, setCardsToShow] = useState(4);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the category from location state (if any)
  const categoryFromState = location.state?.category || 'All';

  // Set the active category when coming from Care (via navigate)
  useEffect(() => {
    if (categoryFromState !== 'All') {
      setActiveCategory(categoryFromState);
    }
  }, [categoryFromState]);

  // Calculate number of cards to show based on screen width and current page
  const calculateCardsToShow = () => {
    const screenWidth = window.innerWidth;

    // Home page layout: specific number of cards based on screen size
    if (!showAll) {
      if (screenWidth >= 1440) {
        setCardsToShow(4); // 4 products in 1 row for XL screens
      } else if (screenWidth >= 1024) {
        setCardsToShow(3); // 3 products in 1 row for large screens
      } else if (screenWidth >= 768) {
        setCardsToShow(4); // 4 products in 2 rows for medium screens (2x2)
      } else {
        setCardsToShow(4); // 4 products in 4 rows for small screens
      }
    } else {
      // Shop page - always show all products
      setCardsToShow(Infinity);
    }
  };

  // Set up resize listener
  useEffect(() => {
    calculateCardsToShow();
    window.addEventListener('resize', calculateCardsToShow);
    return () => {
      window.removeEventListener('resize', calculateCardsToShow);
    };
  }, [showAll]); // Re-run when showAll changes

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
    : filteredProducts.slice(0, cardsToShow);

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleViewAllClick = () => {
    navigate('/shop');
  };

  // Handle category button clicks
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  // Generate dynamic grid classes based on the page type
  const getGridClasses = () => {
    if (showAll) {
      // Shop page - standard responsive grid
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center';
    } else {
      // Home page - specific layout requirements
      return 'grid gap-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div id='our-products-section' className='p-4 bg-gray-50'>
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
        {loading && <CardSkeleton isHomePage={!showAll} />}
        {error && <p className='text-red-600'>Error: {error}</p>}

        {/* Products Grid */}
        {!loading && !error && (
          <div className='w-full max-w-[1240px] mx-auto'>
            <div className={getGridClasses()}>
              {displayedProducts.length === 0 ? (
                <p className='text-gray-600 col-span-full text-center'>
                  No products found for this category.
                </p>
              ) : (
                displayedProducts.map((product) => {
                  return (
                    <div
                      key={product._id}
                      className='cursor-pointer group transform transition duration-300 w-full max-w-[280px]'
                      onClick={() => handleProductClick(product)}
                    >
                      <Card
                        name={product.productName}
                        price={`₹${product.price}`}
                        image={product.image} // Direct Cloudinary URL
                        description={product.description}
                        productId={product._id}
                        product={product}
                      />
                    </div>
                  );
                })
              )}
            </div>
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
