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
    
    if (!showAll) {
      if (screenWidth >= 1440) {
        setCardsToShow(4);
      } else if (screenWidth >= 1024) {
        setCardsToShow(3);
      } else if (screenWidth >= 768) {
        setCardsToShow(4);
      } else {
        setCardsToShow(4);
      }
    } else {
      setCardsToShow(Infinity);
    }
  };

  useEffect(() => {
    calculateCardsToShow();
    window.addEventListener('resize', calculateCardsToShow);
    
    return () => {
      window.removeEventListener('resize', calculateCardsToShow);
    };
  }, [showAll]);

  // UPDATED: Fetch products from your Node.js + Supabase API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (activeCategory !== 'All') {
          params.append('category', activeCategory);
        }
        
        const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
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
  }, [activeCategory]); // Re-fetch when category changes

  // Filter products based on the active category (backup client-side filtering)
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(
        (product) => product.type?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );

  const displayedProducts = showAll 
    ? filteredProducts 
    : filteredProducts.slice(0, cardsToShow);

  const handleProductClick = (product) => {
    navigate(`/product/${product._id || product.id}`, { state: { product } });
  };

  const handleViewAllClick = () => {
    navigate('/shop');
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const getGridClasses = () => {
    if (showAll) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center';
    } else {
      return 'grid gap-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Our Products</h2>
        <p className="text-gray-600 mb-6">
          Nurture your skin naturally with our herbal and homemade skincare essentials
        </p>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['All', 'Body Care', 'Skin Care', 'Hair Care', 'Soap Bars'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full border transition-colors duration-300 ${
                activeCategory === category
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white text-amber-800 border-amber-800 hover:bg-amber-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && <CardSkeleton />}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className={getGridClasses()}>
          {displayedProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No products found for this category.</p>
            </div>
          ) : (
            displayedProducts.map((product) => {
              return (
                <Card
                  key={product._id || product.id}
                  name={product.productName || product.name}
                  price={`₹${product.price}`}
                  image={product.image}
                  productId={product._id || product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              );
            })
          )}
        </div>
      )}

      {/* View All Button */}
      {!showAll && !hideViewAllButton && displayedProducts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleViewAllClick}
            className="bg-amber-800 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors duration-300"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

OurProducts.propTypes = {
  showAll: PropTypes.bool,
  hideViewAllButton: PropTypes.bool,
};

export default OurProducts;
