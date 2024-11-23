import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../Card";
import goldOilImage from "../../assets/Image/goldoil.jpg";
import facewash from "../../assets/Image/facewash.png";

// Carousel data
const jsonData = [
  { id: 1, name: "Saffron & Gold Face Oil", price: "₹2100", image: goldOilImage },
  { id: 2, name: "Face Wash", price: "₹1500", image: facewash },
  { id: 3, name: "Saffron & Gold Face Oil", price: "₹2100", image: goldOilImage },
  { id: 4, name: "Face Wash", price: "₹1500", image: facewash },
  { id: 5, name: "Saffron & Gold Face Oil", price: "₹2100", image: goldOilImage },
  { id: 6, name: "Face Wash", price: "₹1500", image: facewash },
  { id: 7, name: "Saffron & Gold Face Oil", price: "₹2100", image: goldOilImage },
  { id: 8, name: "Face Wash", price: "₹1500", image: facewash },
];

const Winter = () => {
  const sliderRef = useRef(null); // Reference to the Slider instance
  const [slidesToShow, setSlidesToShow] = useState(4); // Default number of cards to display
  const [currentSlide, setCurrentSlide] = useState(0); // Current slide index

  const calculateSlidesToShow = () => {
    const screenWidth = window.innerWidth; // Get the screen width
    const cardWidth = 300; // Width of each card in pixels
    const spaceBetweenCards = 20; // Space between cards in pixels
    const totalCardWidth = cardWidth + spaceBetweenCards;

    if (screenWidth >= 1440) {
      setSlidesToShow(4); // Display exactly 4 cards for 1440px and above
    } else {
      const calculatedSlides = Math.floor(screenWidth / totalCardWidth);
      setSlidesToShow(calculatedSlides);
    }
  };

  useEffect(() => {
    // Initial calculation
    calculateSlidesToShow();

    // Recalculate on window resize
    window.addEventListener("resize", calculateSlidesToShow);
    return () => {
      window.removeEventListener("resize", calculateSlidesToShow);
    };
  }, []);

  const settings = {
    dots: false, // Disable dots
    infinite: false, // Disable infinite loop
    speed: 500,
    slidesToShow: slidesToShow, // Dynamically calculated slides to show
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex), // Update current slide
  };

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide + slidesToShow >= jsonData.length;

  return (
    <div id="winter-carousel" className="p-4 md:p-8 bg-gray-50 text-center relative overflow-hidden">
      <div className="max-w-[1240px] h-[600px] mx-auto relative w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Winter Collection</h2>
        <p className="text-sm md:text-base text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque urna at malesuada.
        </p>

        {/* Carousel Slider */}
        <div className="relative w-full">
          <Slider ref={sliderRef} {...settings}>
            {jsonData.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "0 10px", // Adding space around each card
                }}
              >
                <Card name={item.name} price={item.price} image={item.image} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => sliderRef.current.slickPrev()}
          className={`absolute w-10 h-10 flex items-center justify-center rounded-full border xl:mt-0 ${
            isPrevDisabled
              ? "bg-gray-200 text-gray-400"
              : "bg-button-primary text-white active:bg-primary"
          }`}
          style={{ top: "550px", left: "10px", zIndex: 1 }}
          disabled={isPrevDisabled}
        >
          ←
        </button>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className={`absolute w-10 h-10 flex items-center justify-center rounded-full border xl:mt-0 ${
            isNextDisabled
              ? "bg-gray-200 text-gray-400"
              : "bg-button-primary text-white active:bg-primary"
          }`}
          style={{ top: "550px", right: "10px", zIndex: 1 }}
          disabled={isNextDisabled}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Winter;
