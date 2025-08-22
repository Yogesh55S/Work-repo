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

  // Fetch products from API with enhanced error handling
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'All') {
          params.append('category', activeCategory);
        }
        const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
        
        console.log('Fetching from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw API response:', data);

        // Your Supabase backend already maps the data correctly
        // The productController returns camelCase fields
        let mappedProducts = [];
        if (Array.isArray(data)) {
          mappedProducts = data.map(product => ({
            // Use the fields exactly as returned by your productController
            _id: product._id || product.id,
            productName: product.productName || product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            type: product.type,
            subType: product.subType,
            season: product.season,
            // Keep full product object for navigation
            ...product
          }));
        }

        setProducts(mappedProducts);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('TypeError')) {
          setError('Backend server not running. Please start your Node.js server with: npm start');
        } else if (err.message.includes('ERR_CONNECTION_REFUSED')) {
          setError('Cannot connect to server. Check if backend is running on the correct port.');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeCategory, API_URL]);

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

  // Enhanced error display with backend-specific troubleshooting
  if (error) {
    return (
      <div id='our-products-section' className='p-4 bg-gray-50'>
        <div className='max-w-[1240px] mx-auto text-center'>
          <h2 className='text-3xl md:text-5xl tracking-wider text-[#5C3822] font-medium mb-4'>
            Our Products
          </h2>
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Products</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-red-500 text-left max-w-md mx-auto">
              <p className="font-semibold mb-2">Troubleshooting Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Start your Node.js backend server</li>
                <li>Check your .env file for correct VITE_API_URL</li>
                <li>Verify Supabase connection in backend</li>
                <li>Check browser console for detailed errors</li>
                <li>Ensure backend is running on the expected port</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Category Buttons - Updated to match your backend categories */}
        <div className='flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-8'>
          {['All', 'Face Care', 'Body Care', 'Hair Care', 'Soap Bars'].map(
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
                        image={product.image}
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
        {!hideViewAllButton && !showAll && displayedProducts.length > 0 && (
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