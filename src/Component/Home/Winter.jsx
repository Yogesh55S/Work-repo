import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Correct import for Navigation
import "swiper/css";
import "swiper/css/navigation";
import Card from "../Card";
import { useNavigate } from "react-router-dom";

const Winter = () => {
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        setProducts(data.filter(product => product.subType === "Winter Collection"));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const calculateSlidesToShow = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1440) {
      setSlidesToShow(4);
    } else {
      const cardWidth = 300;
      const spaceBetweenCards = 20;
      const calculatedSlides = Math.floor(screenWidth / (cardWidth + spaceBetweenCards));
      setSlidesToShow(calculatedSlides || 1); // At least 1 slide
    }
  };

  useEffect(() => {
    calculateSlidesToShow();
    window.addEventListener("resize", calculateSlidesToShow);
    return () => {
      window.removeEventListener("resize", calculateSlidesToShow);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 text-center">
      <h2 className="text-2xl md:text-4xl font-medium mb-4">Our Winter Collection</h2>
      <p className="text-sm md:text-base mb-8">Wrap your skin in the pure warmth of our winter care collection!</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={slidesToShow}
          navigation
        >
          {products.map(product => (
            <SwiperSlide key={product._id}>
              <Card
                name={product.productName}
                price={`₹${product.price}`}
                image={`${API_URL.replace('/api', '')}/${product.image.replace(/\\/g, "/")}`}
                productId={product._id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Winter;
