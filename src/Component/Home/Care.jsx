import React from "react";
import { useNavigate } from "react-router-dom";
import goldOilImage from "../../assets/Image/goldoil.jpg"; // Update the path based on your structure
import faceWashImage from "../../assets/Image/facewash.png"; // Update the path based on your structure

// Temporary JSON data
const careData = [
  {
    id: 1,
    title: "Body Care",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.",
    image: goldOilImage,
    type: "Body Care",
  },
  {
    id: 2,
    title: "Skin Care",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.",
    image: faceWashImage,
    type: "Skin Care",
  },
  {
    id: 3,
    title: "Hair Care",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.",
    image: goldOilImage,
    type: "Hair Care",
  },
  {
    id: 4,
    title: "Soap Bars",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.",
    image: faceWashImage,
    type: "Soap Bars",
  },
];

const Care = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Handle category click to navigate to products page
  const handleCategoryClick = (category) => {
    navigate(`/shop/${category}`); // Navigate to /shop/:category
  };

  return (
    <div className="bg-gray-50 py-16 px-4 md:px-6">
      <div className="max-w-[1240px] mx-auto">
        <h2 className="text-3xl md:text-5xl text-button-primary text-center mb-8 md:mb-12">
          Our Care Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careData.map((item) => (
            <div
              key={item.id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => handleCategoryClick(item.type)} // Pass category on click
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[220px] md:w-[615px] md:h-[290px] object-cover group-hover:opacity-70 transition-opacity duration-300"
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center bg-black bg-opacity-30">
                <div className="text-left px-6 md:px-10">
                  <h3 className="text-xl md:text-5xl text-white mb-2 md:mb-4">{item.title}</h3>
                  <p className="text-xs md:text-sm text-white">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Care;
