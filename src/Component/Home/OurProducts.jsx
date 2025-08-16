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

  // Cards calculation
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
    return () => {
      window.removeEventListener('resize', calculateCardsToShow);
    };
  }, [showAll]);

  // Fetch products
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
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Map API response to Card component props
        const mappedProducts = data.map(product => ({
          ...product,
          name: product.product_name,
          productId: product.id,
          image: product.image,
          price: product.price
        }));
        
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Unable to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, API_URL]);

  // Filtering
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(
        (product) => product.type?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, cardsToShow);

  // Error renderer
  const renderError = () => (
    <div style={{ background: '#ffe6e6', color: '#b00020', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
      <h3>Unable to load products</h3>
      <p>
        There was a problem while connecting to the product database.
        <br />
        <strong>{error}</strong>
      </p>
      {error && error.indexOf('Failed to fetch') !== -1 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Possible reasons:</strong>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>The server is not running or unreachable.</li>
            <li>CORS policy is blocking your request. Please ensure the backend allows requests from <code>{window.location.origin}</code>.</li>
            <li>Network connection problem.</li>
          </ul>
          <p>
            Developers: Open browser Console/Network tab for details.<br />
            <a href="https://reactjs.org/link/react-devtools" target="_blank" rel="noopener noreferrer">React DevTools</a>
          </p>
        </div>
      )}
    </div>
  );

  const handleProductClick = (product) => {
    navigate(`/product/${product.productId || product.id}`, { state: { product } });
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

  return (
    <main>
      <h2 className="text-2xl font-bold mb-2">Nurture your skin naturally with our herbal and homemade skincare essentials</h2>
      
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
      
      {error && renderError()}
      
      {loading ? (
        <CardSkeleton />
      ) : !error && displayedProducts.length === 0 ? (
        <p className="text-lg text-gray-500">No products found for this category.</p>
      ) : !error && (
        <section className={getGridClasses()}>
          {displayedProducts.map(product => (
            <Card
              key={product.productId || product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </section>
      )}
      
      {!hideViewAllButton && !showAll && (
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
