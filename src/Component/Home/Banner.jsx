import React, { useState, useEffect } from "react";
import { FaLeaf } from "react-icons/fa"; // Import the Font Awesome Leaf icon
import kittenImage from "../../assets/Image/haldi.png"; // Import the first image
import yogaImage from "../../assets/Image/haldi.png"; // Import the second image
import backgroundImage from "../../assets/Image/bannerbackground.png"; // Import the background image

const banners = 
  [
    {
      id: 1,
      title: "Nature's Essence",
      subtitleLine1: "Pure Ingredients",
      subtitleLine2: "For True Beauty",
      buttonText: "Explore Products",
      image: yogaImage,
    },
    {
      id: 2,
      title: "Natural Radiance",
      subtitleLine1: "Sustainably Sourced",
      subtitleLine2: "Care You Deserve",
      buttonText: "Learn More",
      image: yogaImage,
    },
  ];
  

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="relative h-[100vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay to increase opacity */}
        <div className="absolute inset-0 bg-primary opacity-5"></div>
      </div>

      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 mx-auto flex items-center justify-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full mt-20 h-full  mx-auto flex flex-col md:flex-row items-center md:items-start px-6 md:px-8 lg:px-12 relative z-10">
            {/* Left Side Text */}
            <div className="w-full md:w-[500px] flex flex-col items-start text-left space-y-4 my-auto mx-auto"> 
              {/* Leaf Icon and Natural Beauty Text */}
              <div className="flex items-center space-x-2 text-white text-sm font-medium">
                <FaLeaf className="text-xl" />
                <span>Natural Beauty</span>
              </div>

              <h1 className="text-5xl sm:text-5xl xl:text-7xl lg:text-6xl md:text-5xl font-bold text-white tracking-wider">
                {banner.title}
              </h1>
              <h2 className="text-4xl sm:text-3xl lg:text-5xl xl:text-6xl md:text-4xl font-medium text-white tracking-wider">
                {banner.subtitleLine1}
              </h2>
              <h2 className="text-4xl sm:text-3xl lg:text-5xl xl:text-6xl md:text-4xl font-medium text-white tracking-wider">
                {banner.subtitleLine2}
              </h2>
              <button className="px-6 py-2 bg-button-primary text-white text-lg shadow hover:bg-primary transition">
                {banner.buttonText}
              </button>
            </div>

            {/* Right Side with Dynamic Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center md:mb-0 xs:mb-10 md-sm:mb-36 sm:mb-36">
              <img
                src={banner.image}
                alt="Banner Image"
                className="w-full  md:w-full h-full md:h-[90vh]"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;
