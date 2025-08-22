import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from '../Card';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import CardSkeleton from '../skeletons/Cardskeleton';
import loadingGif from "../../assets/loader/loader.png";

const Winter = ({ collectionName = "Monsoon Collection" }) => {
  const sliderRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const extractSeasonFromCollection = (collectionName) => {
    const lower = collectionName.toLowerCase();
    if (lower.includes('monsoon')) return 'Monsoon';
    if (lower.includes('winter')) return 'Winter';
    if (lower.includes('summer')) return 'Summer';
    if (lower.includes('spring')) return 'Spring';
    return null;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const season = extractSeasonFromCollection(collectionName);
        let apiUrl = `${API_URL}/products`;
        if (season) apiUrl += `?season=${season}`;
        
        console.log('Fetching products with URL:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw products data:', data);

        // Your backend returns products in the correct format already
        // Map to Card component props with your Supabase field structure
        let mappedProducts = Array.isArray(data) ? data.map(product => ({
          // Card component expects these exact props
          name: product.productName || product.name || 'Unknown Product',
          price: `₹${product.price || 0}`,
          image: product.image || '/placeholder.jpg',
          productId: product._id || product.id,
          product: product // Full product object for navigation
        })) : [];

        // Legacy filtering if no season-based filtering
        if (!season) {
          mappedProducts = mappedProducts.filter(item => 
            item.product.subType === collectionName || item.product.sub_type === collectionName
          );
        }

        console.log(`Found ${mappedProducts.length} products for ${season || collectionName}`);
        setProducts(mappedProducts);
        setError(null);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('TypeError')) {
          setError('Backend server not running. Please start your Node.js server.');
        } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
          setError('Cannot connect to server. Check if backend is running on correct port.');
        } else {
          setError(error.message);
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL, collectionName]);

  // Handle page loader
  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    };

    window.addEventListener("load", handlePageLoad);

    if (document.readyState === "complete") {
      handlePageLoad();
    }

    if (!loading) {
      setTimeout(() => {
        setShowLoader(false);
      }, 300);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, [loading]);

  const calculateSlidesToShow = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1440) {
      setSlidesToShow(4);
    } else if (screenWidth >= 1024) {
      setSlidesToShow(3);
    } else if (screenWidth >= 768) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(1);
    }
  };

  useEffect(() => {
    calculateSlidesToShow();
    window.addEventListener('resize', calculateSlidesToShow); 
    return () => {
      window.removeEventListener('resize', calculateSlidesToShow);
    };
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide + slidesToShow >= products.length;

  const handleProductClick = (product) => {
    navigate(`/product/${product.productId}`, { state: { product: product.product } });
  };

  // Get display content based on collection name
  const getDisplayContent = (collectionName) => {
    const lower = collectionName.toLowerCase();
    if (lower.includes('monsoon')) {
      return {
        title: "Monsoon Collection",
        description: "Embrace the season with our Monsoon Collection—made to hydrate, soothe, and protect your skin against humidity, stickiness, and sudden breakouts. Powered by 100% natural, plant-based ingredients."
      };
    }
    if (lower.includes('winter')) {
      return {
        title: "Winter Collection",
        description: "Embrace the winter season with our nourishing collection, specially formulated to protect and heal your skin during the cold, dry months. Powered by 100% natural, plant-based ingredients."
      };
    }
    if (lower.includes('summer')) {
      return {
        title: "Summer Collection",
        description: "Beat the heat with our refreshing summer collection, designed to cool and soothe your skin during hot, sunny days. Powered by 100% natural, plant-based ingredients."
      };
    }
    if (lower.includes('spring')) {
      return {
        title: "Spring Collection",
        description: "Rejuvenate with our spring collection, perfect for renewal and fresh beginnings as nature blooms around you. Powered by 100% natural, plant-based ingredients."
      };
    }
    return {
      title: `${collectionName}`,
      description: `Explore our ${lower} collection, specially curated for the season. Powered by 100% natural, plant-based ingredients.`
    };
  };

  const displayContent = getDisplayContent(collectionName);

  // Show loader while page is loading
  if (showLoader) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <img src={loadingGif} alt="Loading..." className="w-32 h-32 mx-auto" />
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id='winter-carousel'
      className='py-16 px-4 md:px-8 bg-white'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-6 tracking-wide'>
            {displayContent.title}
          </h1>
          <div className='max-w-4xl mx-auto'>
            <p className='text-base md:text-lg text-gray-700 leading-relaxed px-4'>
              {displayContent.description}
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className='relative'>
          {loading ? (
            <CardSkeleton />
          ) : error ? (
            <div className='text-center py-12'>
              <p className='text-red-600 text-lg'>Error: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-xl text-gray-500'>No products available for {displayContent.title} at the moment.</p>
            </div>
          ) : (
            <>
              {/* Products Carousel */}
              <div className='relative px-12'>
                <Slider ref={sliderRef} {...settings}>
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      onClick={() => handleProductClick(product)}
                      className='cursor-pointer px-3'
                    >
                      <div className='w-full transform transition duration-300 hover:scale-105'>
                        <Card
                          name={product.name}
                          price={product.price}
                          image={product.image}
                          product={product.product}
                          productId={product.productId}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                {/* Navigation Arrows */}
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all duration-300 z-10 ${
                    isPrevDisabled 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'hover:border-gray-500 hover:bg-gray-50 shadow-lg'
                  }`}
                  disabled={isPrevDisabled}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600 text-lg" />
                </button>

                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all duration-300 z-10 ${
                    isNextDisabled 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'hover:border-gray-500 hover:bg-gray-50 shadow-lg'
                  }`}
                  disabled={isNextDisabled}
                >
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-600 text-lg" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Winter;