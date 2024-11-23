import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";
import goldOilImage from "../../assets/Image/goldoil.jpg";
import faceWashImage from "../../assets/Image/facewash.png";

// Temporary JSON Data
const productData = [
  { id: 1, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Skin Care", image: goldOilImage },
  { id: 2, name: "Gentle Face Wash", price: "₹1500", category: "Skin Care", image: faceWashImage },
  { id: 3, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Body Care", image: goldOilImage },
  { id: 4, name: "Gentle Face Wash", price: "₹1500", category: "Hair Care", image: faceWashImage },
  { id: 5, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Soap Bars", image: goldOilImage },
  { id: 6, name: "Gentle Face Wash", price: "₹1500", category: "Body Care", image: faceWashImage },
  { id: 7, name: "Saffron & Gold Face Oil", price: "₹2100", category: "Skin Care", image: goldOilImage },
  { id: 8, name: "Gentle Face Wash", price: "₹1500", category: "Soap Bars", image: faceWashImage },
];

const OurProducts = () => {
  const navigate = useNavigate();

  // Handle navigation to product details
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-[1240px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Products</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at malesuada.
        </p>

        {/* Products Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productData.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer group"
              onClick={() => handleProductClick(product)}
            >
              <Card name={product.name} price={product.price} image={product.image} />
              <style jsx>{`
                .group:hover img {
                  transform: scale(1.05);
                  transition: transform 0.3s ease;
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurProducts;
