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

  const extractSeasonFromCollection = (collectionName) => {
    const lower = collectionName.toLowerCase();
    if (lower.includes('monsoon')) return 'Monsoon';
    if (lower.includes('winter')) return 'Winter';
    if (lower.includes('summer')) return 'Summer';
    if (lower.includes('spring')) return 'Spring';
    return null;
  };

  // Fetch active season data
  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const response = await fetch(`${API_URL}/seasons/active`);
        if (!response.ok) throw new Error('Failed to fetch season');
        const data = await response.json();
        if (data.success && data.season) {
          setSeasonData(data.season);
        }
      } catch (error) {
        console.error('Error fetching season data:', error);
      }
    };
    fetchSeasonData();
  }, [API_URL]);

  // ✅ FIXED: Fetch products with proper mapping
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const season = extractSeasonFromCollection(collectionName) || seasonData?.season_name;
        let apiUrl = `${API_URL}/products`;
        if (season) apiUrl += `?season=${season}`;
        
        console.log('Fetching products with URL:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw products data:', data);

        // ✅ Map to Card component props
        let mappedProducts = Array.isArray(data) ? data.map(product => ({
          name: product.product_name || product.name || 'Unknown Product',
          price: `₹${product.price || 0}`, // Card expects string with ₹ symbol
          image: product.image || '/placeholder.jpg',
          productId: product.id || product._id || Math.random().toString(36),
          product: product // Full product object
        })) : [];

        // Apply legacy filtering if no season
        if (!season) {
          mappedProducts = mappedProducts.filter(item => 
            item.product.sub_type === collectionName
          );
        }

        console.log('Final mapped products:', mappedProducts);
        setProducts(mappedProducts);
        setError(null);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('TypeError')) {
          setError('Server connection failed. Please restart your backend server.');
        } else {
          setError(error.message);
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (collectionName || seasonData) {
      fetchProducts();
    }
  }, [API_URL, collectionName, seasonData]);

  // Loader management
  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => setShowLoader(false), 500);
    };
    window.addEventListener("load", handlePageLoad);
    if (document.readyState === "complete") handlePageLoad();
    if (!loading) setTimeout(() => setShowLoader(false), 300);
    return () => window.removeEventListener("load", handlePageLoad);
  }, [loading]);

  const calculateSlidesToShow = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1440) setSlidesToShow(4);
    else if (screenWidth >= 1024) setSlidesToShow(3);
    else if (screenWidth >= 768) setSlidesToShow(2);
    else setSlidesToShow(1);
  };

  useEffect(() => {
    calculateSlidesToShow();
    window.addEventListener('resize', calculateSlidesToShow);
    return () => window.removeEventListener('resize', calculateSlidesToShow);
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

  const displayContent = seasonData
    ? {
        name: seasonData.collection_name || collectionName,
        description: seasonData.collection_description || getDefaultDescription(collectionName),
        bannerDesktop: seasonData.banner_image_desktop,
        bannerMobile: seasonData.banner_image_mobile
      }
    : {
        name: collectionName,
        description: getDefaultDescription(collectionName),
        bannerDesktop: null,
        bannerMobile: null
      };

  function getDefaultDescription(name) {
    const lower = name.toLowerCase();
    if (lower.includes('monsoon')) return "Discover our exclusive monsoon collection, crafted for lush season—formulated to keep your skin fresh, healthy, and protected from humidity and rain.";
    if (lower.includes('winter')) return "Embrace the winter season with our nourishing collection, specially formulated to protect and heal your skin during the cold, dry months.";
    if (lower.includes('summer')) return "Beat the heat with our refreshing summer collection, designed to cool and soothe your skin during hot, sunny days.";
    if (lower.includes('spring')) return "Rejuvenate with our spring collection, perfect for renewal and fresh beginnings as nature blooms around you.";
    return `Explore our ${lower} specially curated for the season.`;
  }

  if (showLoader) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <img src={loadingGif} alt="Loading..." className="w-16 h-16 mb-4" />
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  // ✅ Better error display
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load {displayContent.name}</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="winter-collection-section">
      <div className="mb-4">
        <h2 className="font-bold text-2xl mb-1">{displayContent.name}</h2>
        <p className="text-gray-700">{displayContent.description}</p>
      </div>
      
      {loading ? (
        <CardSkeleton />
      ) : products.length === 0 ? (
        <p className="text-lg text-gray-500">No products available for {displayContent.name} at the moment.</p>
      ) : (
        <div className="relative">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            disabled={isPrevDisabled}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full ${
              isPrevDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <button
            onClick={() => sliderRef.current?.slickNext()}
            disabled={isNextDisabled}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full ${
              isNextDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <Slider ref={sliderRef} {...settings}>
            {products.map(product => (
              <div key={product.productId} className="px-2">
                <Card
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  productId={product.productId}
                  product={product.product}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default Winter;
