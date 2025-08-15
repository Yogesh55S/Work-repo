// src/Component/Home/Winter.jsx
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
  const [seasonData, setSeasonData] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Extract season from collection name
  const extractSeasonFromCollection = (collectionName) => {
    if (collectionName.toLowerCase().includes('monsoon')) return 'Monsoon';
    if (collectionName.toLowerCase().includes('winter')) return 'Winter';
    if (collectionName.toLowerCase().includes('summer')) return 'Summer';
    if (collectionName.toLowerCase().includes('spring')) return 'Spring';
    return null;
  };

  // Fetch active season data
  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const response = await fetch(`${API_URL}/seasons/active`);
        const data = await response.json();
        
        if (data.success && data.season) {
          setSeasonData(data.season);
          console.log('Active season data:', data.season);
        }
      } catch (error) {
        console.error('Error fetching season data:', error);
      }
    };

    fetchSeasonData();
  }, [API_URL]);

  // Fetch products based on season
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get season from collection name or use active season
        const season = extractSeasonFromCollection(collectionName) || seasonData?.season_name;
        
        // Build API URL with season filter
        let apiUrl = `${API_URL}/products`;
        if (season) {
          apiUrl += `?season=${season}`;
        }

        console.log('Fetching products with URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // If no season filter, fallback to subType filtering (backward compatibility)
        let filteredProducts = data;
        if (!season) {
          filteredProducts = data.filter(
            (product) => product.subType === collectionName
          );
        }

        console.log('Filtered products:', filteredProducts);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch products when we have either collectionName or seasonData
    if (collectionName || seasonData) {
      fetchProducts();
    }
  }, [API_URL, collectionName, seasonData]);

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
    navigate(`/product/${product._id || product.id}`, { state: { product } });
  };

  // Get dynamic content based on season data or fallback to defaults
  const getDisplayContent = () => {
    if (seasonData) {
      return {
        name: seasonData.collection_name || collectionName,
        description: seasonData.collection_description || getDefaultDescription(),
        bannerDesktop: seasonData.banner_image_desktop,
        bannerMobile: seasonData.banner_image_mobile
      };
    }
    
    return {
      name: collectionName,
      description: getDefaultDescription(),
      bannerDesktop: null,
      bannerMobile: null
    };
  };

  const getDefaultDescription = () => {
    const lowerCollection = collectionName.toLowerCase();
    
    if (lowerCollection.includes('monsoon')) {
      return "Discover our exclusive monsoon collection, crafted for lush season—formulated to keep your skin fresh, healthy, and protected from humidity and rain.";
    } else if (lowerCollection.includes('winter')) {
      return "Embrace the winter season with our nourishing collection, specially formulated to protect and heal your skin during the cold, dry months.";
    } else if (lowerCollection.includes('summer')) {
      return "Beat the heat with our refreshing summer collection, designed to cool and soothe your skin during hot, sunny days.";
    } else if (lowerCollection.includes('spring')) {
      return "Rejuvenate with our spring collection, perfect for renewal and fresh beginnings as nature blooms around you.";
    }
    
    return `Explore our ${lowerCollection} specially curated for the season.`;
  };

  const displayContent = getDisplayContent();

  // Show loader while page is loading
  if (showLoader) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          flexDirection: "column",
        }}
      >
        <img
          src={loadingGif}
          alt="Loading..."
          style={{ width: "80px", height: "80px" }}
        />
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: "#666",
            fontWeight: "500",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="winter-collection">
      {/* Dynamic Season Banner */}
      {displayContent.bannerDesktop && (
        <div className="season-banner mb-8">
          <picture>
            <source 
              media="(max-width: 768px)" 
              srcSet={displayContent.bannerMobile || displayContent.bannerDesktop} 
            />
            <img 
              src={displayContent.bannerDesktop} 
              alt={displayContent.name}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              style={{ maxHeight: '400px' }}
            />
          </picture>
        </div>
      )}

      {/* Collection Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {displayContent.name}
        </h1>
        <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
          {displayContent.description}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error ? (
        <CardSkeleton />
      ) : (
        <>
          {/* Products Section */}
          {products.length > 0 ? (
            <div className="relative">
              {/* Navigation Buttons */}
              {products.length > slidesToShow && (
                <>
                  <button
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isPrevDisabled
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-600 shadow-md'
                    }`}
                    onClick={() => sliderRef.current.slickPrev()}
                    disabled={isPrevDisabled}
                    style={{ left: '-20px' }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} size="sm" />
                  </button>

                  <button
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isNextDisabled
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-600 shadow-md'
                    }`}
                    onClick={() => sliderRef.current.slickNext()}
                    disabled={isNextDisabled}
                    style={{ right: '-20px' }}
                  >
                    <FontAwesomeIcon icon={faArrowRight} size="sm" />
                  </button>
                </>
              )}

             {/* Products Slider */}
<Slider ref={sliderRef} {...settings}>
  {products.map((product, index) => (
    <div key={product._id || product.id || index} className="px-2">
      <Card
        name={product.productName || product.name || 'No Name'}
        price={product.price ? product.price.toString() : '0'}  // Convert to string
        image={product.image || ''}
        productId={product._id || product.id || ''}
        onClick={() => handleProductClick(product)}
      />
    </div>
  ))}
</Slider>


              {/* View All Button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate('/shop', { 
                    state: { 
                      seasonFilter: extractSeasonFromCollection(displayContent.name) || seasonData?.season_name 
                    } 
                  })}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  View All {displayContent.name}
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* No Products State */
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Available
                </h3>
                <p className="text-gray-500">
                  No products available for {displayContent.name} at the moment.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Browse All Products
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Debug Info (only in development) */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p>Collection Name: {collectionName}</p>
          <p>Season Data: {seasonData ? seasonData.season_name : 'None'}</p>
          <p>Products Count: {products.length}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default Winter;
