import React, { useRef, useState } from "react";
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
  const [currentSlide, setCurrentSlide] = useState(0); // Current slide index

  const settings = {
    dots: false, // Disable dots
    infinite: false, // Disable infinite loop
    speed: 500,
    slidesToShow: 3, // Default: 3 cards
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex), // Update current slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide + settings.slidesToShow >= jsonData.length;

  return (
    <div id="winter-carousel" className="p-4 md:p-8 bg-gray-50 text-center relative">
      <div className="max-w-[1240px] h-[600px] my-auto mx-auto relative">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Winter Collection</h2>
        <p className="text-sm md:text-base text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque urna at malesuada.
        </p>

        {/* Carousel Slider */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {jsonData.map((item, index) => (
              <div key={index} className="p-2">
                <Card name={item.name} price={item.price} image={item.image} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => sliderRef.current.slickPrev()}
          className={`absolute w-10 h-10 flex items-center justify-center rounded-full border xl:mt-0   ${
            isPrevDisabled
              ? "bg-gray-200 text-gray-400 "
              : "bg-button-primary text-white active:bg-primary "
          }`}
          style={{  top: "550px", left: "2%", zIndex: 1 }}
          disabled={isPrevDisabled}
        >
          ←
        </button>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className={`absolute w-10 h-10 flex items-center justify-center rounded-full border xl:mt-0  ${
            isNextDisabled
              ? "bg-gray-200 text-gray-400 "
              : "bg-button-primary text-white active:bg-primary "
          }`}
          style={{  top: "550px", right: "2%", zIndex: 1 }}
          disabled={isNextDisabled}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Winter;
