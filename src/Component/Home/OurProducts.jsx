import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";
import goldOilImage from "../../assets/Image/goldoil.jpg";
import faceWashImage from "../../assets/Image/facewash.png";


// Temporary JSON Data
const productData = [
  { id: 1, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Skin Care", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 2, name: "Gentle Face Wash", price: "₹1500", category: "Skin Care", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 3, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Body Care", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 4, name: "Gentle Face Wash", price: "₹1500", category: "Hair Care", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 5, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Soap Bars", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 6, name: "Gentle Face Wash", price: "₹1500", category: "Body Care", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 7, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Skin Care", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 8, name: "Gentle Face Wash", price: "₹1500", category: "Soap Bars", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 9, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Skin Care", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 10, name: "Gentle Face Wash", price: "₹1500", category: "Skin Care", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 11, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Body Care", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 12, name: "Gentle Face Wash", price: "₹1500", category: "Hair Care", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 13, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Soap Bars", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 14, name: "Gentle Face Wash", price: "₹1500", category: "Body Care", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 15, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Skin Care", image: goldOilImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 16, name: "Gentle Face Wash", price: "₹1500", category: "Soap Bars", image: faceWashImage,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
];

const OurProducts = ({ showAll, hideViewAllButton }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    setProducts(productData);
  }, []);

  // Filtered products based on active category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Display limited products if `showAll` is false
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 8);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleViewAllClick = () => {
    navigate("/shop"); // Redirect to shop page
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-[1240px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Products</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-8">
          {["All", "Body Care", "Skin Care", "Hair Care", "Soap Bars"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 sm:px-4 py-2 border font-medium mb-2 ${
                activeCategory === category
                  ? "bg-button-primary text-white"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-primary hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer group"
              onClick={() => handleProductClick(product)}
            >
              <Card name={product.name} price={product.price} image={product.image} description={product.description} />
              <style jsx>{`
                .group:hover img {
                  transform: scale(1.05);
                  transition: transform 0.3s ease;
                }
              `}</style>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {!hideViewAllButton && (
          <div className="mt-8">
            <button
              onClick={handleViewAllClick}
              className="px-6 py-2 bg-button-primary text-white text-lg shadow hover:bg-primary transition"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurProducts;
