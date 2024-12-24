import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../Card";
import { useNavigate } from "react-router-dom";

const Winter = () => {
  const sliderRef = useRef(null); // Initialize the sliderRef
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // Initialize navigate

  // Fetch products for the Winter Collection (with full details)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        // Filter products by subtype "Winter Collection"
        const filteredProducts = data.filter(
          (product) => product.subType === "Winter Collection"
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  // Handle screen resize to calculate how many slides to show
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
    window.addEventListener("resize", calculateSlidesToShow);
    return () => {
      window.removeEventListener("resize", calculateSlidesToShow);
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
    <div id="winter-carousel" className="p-4 md:p-8 bg-gray-50 text-center relative overflow-hidden">
      <div className="max-w-[1240px] h-[600px] mx-auto relative w-full">
        <h2 className="text-2xl md:text-4xl tracking-wider text-[#5C3822] font-medium mb-4 xs:text-center">
          Our Winter Collection
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-8 xs:text-center">
          Wrap your skin in the pure warmth of our winter care collection!
        </p>

        {loading ? (
          <p className="text-gray-600">Loading winter products...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <div className="relative w-full">
            <Slider ref={sliderRef} {...settings}>
              {products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    padding: "0 10px",
                  }}
                  onClick={() => handleProductClick(product)} // Pass the entire product data on click
                >
                  <Card
                    name={product.productName}
                    price={`₹${product.price}`}
                    image={`${API_URL.replace('/api', '')}/${product.image.replace(/\\/g, "/")}`}
                    product={product} // Pass the full product data to the Card component
                    productId={product._id}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}

        <button
          onClick={() => sliderRef.current.slickPrev()}
          className={`winter-carousel-button-2 top-[95%] md:top-[100%] text-2xl ${isPrevDisabled ? "disabled" : "active"}`}
          style={{ position: "absolute", left: "10px", transform: "translateY(-50%)" }}
          disabled={isPrevDisabled}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className={`winter-carousel-button-2 text-2xl top-[95%] md:top-[100%] ${isNextDisabled ? "disabled" : "active"}`}
          style={{ position: "absolute", right: "10px", transform: "translateY(-50%)" }}
          disabled={isNextDisabled}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Winter;
