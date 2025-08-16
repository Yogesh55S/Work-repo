import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
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

  const categoryFromState = location.state?.category || 'All';

  useEffect(() => {
    if (categoryFromState !== 'All') {
      setActiveCategory(categoryFromState);
    }
  }, [categoryFromState]);

  const calculateCardsToShow = () => {
    const screenWidth = window.innerWidth;
    if (!showAll) {
      if (screenWidth >= 1440) setCardsToShow(4);
      else if (screenWidth >= 1024) setCardsToShow(3);
      else if (screenWidth >= 768) setCardsToShow(4);
      else setCardsToShow(4);
    } else {
      setCardsToShow(Infinity);
    }
  };

  useEffect(() => {
    calculateCardsToShow();
    window.addEventListener('resize', calculateCardsToShow);
    return () => window.removeEventListener('resize', calculateCardsToShow);
  }, [showAll]);

  // ✅ FIXED: Fetch with proper data mapping
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

        // ✅ Map to Card component props exactly
        const mappedProducts = Array.isArray(data) ? data.map(product => ({
          // Card expects these exact prop names:
          name: product.product_name || product.name || 'Unknown Product',
          price: `₹${product.price || 0}`, // Card expects string with ₹ symbol
          image: product.image || '/placeholder.jpg',
          productId: product.id || product._id || Math.random().toString(36),
          product: product // Full product object for navigation
        })) : [];

        console.log('Mapped products:', mappedProducts);
        setProducts(mappedProducts);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('TypeError')) {
          setError('Server connection failed. Please restart your backend server.');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, API_URL]);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => 
        product.product?.type?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, cardsToShow);

  const handleProductClick = (product) => {
    navigate(`/product/${product.productId}`, { state: { product: product.product } });
  };

  const handleViewAllClick = () => {
    navigate('/shop');
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const getGridClasses = () => {
    return showAll
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center'
      : 'grid gap-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  // ✅ Better error display
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Products</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="text-sm text-red-500">
          <p>• Check if backend server is running on port 5000</p>
          <p>• Verify CORS configuration in app.js</p>
          <p>• Restart both frontend and backend</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <h2 className="text-2xl font-bold mb-2">
        Nurture your skin naturally with our herbal and homemade skincare essentials
      </h2>
      
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['All', 'Face Care', 'Body Care', 'Hair Care'].map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton />
      ) : displayedProducts.length === 0 ? (
        <p className="text-lg text-gray-500">No products found for this category.</p>
      ) : (
        <section className={getGridClasses()}>
          {displayedProducts.map(product => (
            <Card
              key={product.productId}
              name={product.name}
              price={product.price}
              image={product.image}
              productId={product.productId}
              product={product.product}
            />
          ))}
        </section>
      )}
      
      {!hideViewAllButton && !showAll && displayedProducts.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
            onClick={handleViewAllClick}
          >
            View All Products
          </button>
        </div>
      )}
    </main>
  );
};

OurProducts.propTypes = {
  showAll: PropTypes.bool,
  hideViewAllButton: PropTypes.bool
};

export default OurProducts;
