import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import goldOilImage from "../assets/Image/goldoil.jpg";
import faceWashImage from "../assets/Image/facewash.png";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product;

  // List of images for carousel and thumbnails
  const images = [product.image, goldOilImage, faceWashImage,goldOilImage];

  // State to track the currently displayed image
  const [currentImage, setCurrentImage] = useState(images[0]);

  if (!product) {
    return <div className="text-center text-gray-600">Product not found.</div>;
  }

  return (
    <div className="max-w-full mx-auto p-4 pt-28">
      <div className="container mx-auto lg:w-[1240px]">
        {/* Main Container */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 lg:space-x-12 space-y-8 md:space-y-0">
          {/* Left Section: Product Image */}
          <div className="flex-1 w-full md:w-[40%] lg:w-[50%]">
            <div className="relative">
              <img
                src={currentImage}
                alt="Selected Product"
                className="w-full h-auto object-cover shadow md:w-[100%] md:mx-auto" // Reduce size in 768px frame
              />
            </div>

            {/* Thumbnails */}
            <div className="flex mt-4  space-x-4 overflow-x-auto">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setCurrentImage(img)} // Change main image on thumbnail click
                  className={`w-16 h-16 md:w-20 md:h-20 object-cover  shadow cursor-pointer ${
                    currentImage === img ? "ring-2 ring-button-primary" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Section: Product Details */}
          <div className="flex-1 w-full md:w-[60%] lg:w-[50%]">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <p className="text-lg text-red-600 font-semibold mr-4">{product.price}</p>
              {/* <p className="line-through text-gray-400 text-sm md:text-base">₹2500</p> */}
            </div>
            <div className="text-yellow-500 flex items-center space-x-1 mb-4 text-sm md:text-base">
              {"⭐".repeat(4)}
              {"☆".repeat(1)} <span className="text-gray-600">(2 Customer Reviews)</span>
            </div>
            <p className="text-gray-700 text-sm md:text-base mb-6">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center mb-6">
              <button className="px-3 py-1 border text-gray-600">-</button>
              <input
                type="text"
                defaultValue={1}
                className="w-12 text-center border-y border-gray-300"
              />
              <button className="px-3 py-1 border text-gray-600">+</button>
              <button className="ml-4 px-6 py-2 bg-button-primary text-white font-medium text-sm md:text-base shadow hover:bg-primary transition">
                Add to Cart
              </button>
            </div>

            {/* Info Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Info</h3>
              <ul className="text-gray-600 text-sm md:text-base space-y-1">
                <li>SKU: {product.id}</li>
                <li>Category: {product.category}</li>
                <li>Tags: Skin, Health, Beauty</li>
              </ul>
            </div>

            {/* Share Links */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Share:</h3>
              <div className="flex space-x-4 text-gray-500 text-xl">
                <i className="fab fa-facebook cursor-pointer"></i>
                <i className="fab fa-twitter cursor-pointer"></i>
                <i className="fab fa-instagram cursor-pointer"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 border-t pt-8 mx-auto container  lg:w-[1240px]">
        <div className="flex flex-wrap space-x-4 border-b pb-4 text-sm md:text-base">
          <button className="text-gray-800 font-medium border-b-2 border-button-primary">
            Description
          </button>
          <button className="text-gray-600">Additional Information</button>
          <button className="text-gray-600">Reviews</button>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu turpis magna. Mauris
            euismod sollicitudin mauris. Ut tempor, sapien a volutpat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
