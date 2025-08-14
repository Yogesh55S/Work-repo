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

  // Extract season from collection name
  const extractSeasonFromCollection = (collectionName) => {
    if (collectionName.toLowerCase().includes('monsoon')) return 'Monsoon';
    if (collectionName.toLowerCase().includes('winter')) return 'Winter';
    if (collectionName.toLowerCase().includes('summer')) return 'Summer';
    if (collectionName.toLowerCase().includes('spring')) return 'Spring';
    return null; // Return null if no season found
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get season from collection name
        const season = extractSeasonFromCollection(collectionName);
        
        // Build API URL with season filter
        let apiUrl = `${API_URL}/products`;
        if (season) {
          apiUrl += `?season=${season}`;
        }
        
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
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
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
    navigate(`/product/${product._id || product.id}`, { state: { product } });
  };

  // Show loader while page is loading
  if (showLoader) {
    return (
      <div className="loader-container bg-white flex justify-center items-center min-h-screen">
        <div className="text-center">
          <img 
            src={loadingGif} 
            alt="Loading..." 
            className="mx-auto mb-4 w-16 h-16 animate-spin"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Dynamic heading based on collection name */}
        <div className="text-center mb-12">
          <h2 className='text-2xl md:text-4xl tracking-wider text-[#5C3822] font-medium mb-4 xs:text-center'>
            Our {collectionName}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {collectionName.toLowerCase().includes('monsoon') 
              ? "Discover our exclusive monsoon collection, crafted for Nidaspur's lush season—formulated to keep your skin fresh, healthy, and protected from humidity and rain."
              : collectionName.toLowerCase().includes('winter')
              ? "Embrace the winter season with our nourishing collection, specially formulated to protect and heal your skin during the cold, dry months."
              : `Explore our ${collectionName.toLowerCase()} specially curated for the season.`
            }
          </p>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No products available for {collectionName} at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Slider */}
            <Slider ref={sliderRef} {...settings}>
              {products.map((product) => (
                <div key={product._id || product.id} className="px-2">
                  <Card
                    name={product.productName || product.name}
                    price={`₹${product.price}`}
                    image={product.image}
                    productId={product._id || product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                </div>
              ))}
            </Slider>

            {/* Navigation buttons */}
            {products.length > slidesToShow && (
              <>
                <button
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isPrevDisabled 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-[#5C3822] hover:bg-[#5C3822] hover:text-white'
                  }`}
                  onClick={() => sliderRef.current?.slickPrev()}
                  disabled={isPrevDisabled}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <button
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isNextDisabled 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-[#5C3822] hover:bg-[#5C3822] hover:text-white'
                  }`}
                  onClick={() => sliderRef.current?.slickNext()}
                  disabled={isNextDisabled}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Winter;
