import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from '../Card';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import CardSkeleton from '../skeltons/Cardskelton';

const Winter = () => {
  const sliderRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        const filteredProducts = data.filter(
          (product) => product.subType === 'Winter Collection'
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const calculateSlidesToShow = () => {
    const screenWidth = window.innerWidth;
    const cardWidth = 300;
    const spaceBetweenCards = 20;
    const totalCardWidth = cardWidth + spaceBetweenCards;

    if (screenWidth >= 1440) {
      setSlidesToShow(4);
    } else {
      const calculatedSlides = Math.floor(screenWidth / totalCardWidth);
      setSlidesToShow(calculatedSlides);
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
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div
      id='winter-carousel'
      className='p-4 md:p-8 bg-gray-50 text-center relative overflow-hidden'
    >
      <div className='max-w-[1240px] h-[600px] mx-auto relative w-full'>
        <h2 className='text-2xl md:text-4xl tracking-wider text-[#5C3822] font-medium mb-4 xs:text-center'>
          Our Winter Collection
        </h2>
        <p className='text-sm md:text-base text-gray-600 mb-8 xs:text-center'>
          Discover our exclusive winter collection, designed to keep your skin
          and body healthy and nourished during the cold months.
        </p>

        {loading ? (
          <CardSkeleton />
        ) : error ? (
          <p className='text-red-600'>Error: {error}</p>
        ) : (
          <div className='relative w-full'>
            <Slider ref={sliderRef} {...settings}>
              {products.map((product) => (
                <div
                  className='cursor-pointer flex flex-wrap justify-center mx-auto gap-3'
                  key={product._id}
                  style={{ padding: '0 10px' }}
                  onClick={() => handleProductClick(product)}
                >
                  <Card
                    name={product.productName}
                    price={`₹${product.price}`}
                    image={`${API_URL.replace(
                      '/api',
                      ''
                    )}/${product.image.replace(/\\/g, '/')}`}
                    product={product}
                    productId={product._id}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}

        <button
          onClick={() => sliderRef.current.slickPrev()}
          className={`winter-carousel-button-2 top-[95%] md:top-[100%] text-2xl ${
            isPrevDisabled ? 'disabled' : 'active'
          }`}
          style={{
            position: 'absolute',
            left: '10px',
            transform: 'translateY(-50%)',
          }}
          disabled={isPrevDisabled}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className={`winter-carousel-button-2 text-2xl top-[95%] md:top-[100%] ${
            isNextDisabled ? 'disabled' : 'active'
          }`}
          style={{
            position: 'absolute',
            right: '10px',
            transform: 'translateY(-50%)',
          }}
          disabled={isNextDisabled}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Winter;
