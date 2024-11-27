import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import goldOilImage from "../assets/Image/goldoil.jpg";
import faceWashImage from "../assets/Image/facewash.png";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product;

  // List of images for carousel and thumbnails
  const images = [product.image, goldOilImage, faceWashImage, goldOilImage];

  // State to track the currently displayed image
  const [currentImage, setCurrentImage] = useState(images[0]);

  // State to handle tab selection
  const [activeTab, setActiveTab] = useState("Description");

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
                className="w-full h-auto object-cover shadow md:w-[100%] md:mx-auto"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex mt-4 space-x-4 overflow-x-auto">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setCurrentImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 object-cover shadow cursor-pointer ${
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
              <button className="ml-4 px-6 py-2 bg-pink-400 text-white font-medium text-sm md:text-base shadow hover:bg-pink-500 transition">
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
      <div className="mt-12 border-t pt-8 mx-auto container lg:w-[1240px]">
        <div className="flex flex-wrap space-x-4 border-b pb-4 text-sm md:text-base">
          <button
            className={`px-4 py-2 ${
              activeTab === "Description"
                ? "bg-pink-200 text-gray-800 border-b-2 border-button-primary"
                : "bg-transparent text-gray-600"
            } rounded`}
            onClick={() => setActiveTab("Description")}
          >
            Description
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Additional Information"
                ? "bg-pink-200 text-gray-800 border-b-2 border-button-primary"
                : "bg-transparent text-gray-600"
            } rounded`}
            onClick={() => setActiveTab("Additional Information")}
          >
            Additional Information
          </button>
        </div>

        {/* Content based on selected tab */}
        {activeTab === "Description" && (
          <div className="mt-4">
            <p className="text-gray-700 text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu turpis magna. Mauris
              euismod sollicitudin mauris. Ut tempor, sapien a volutpat.
            </p>
          </div>
        )}

        {activeTab === "Additional Information" && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Replace these divs with dynamic related products */}
            {[goldOilImage, faceWashImage, goldOilImage, faceWashImage].map((img, index) => (
              <div key={index} className="relative shadow p-4 rounded">
                <img
                  src={img}
                  alt={`Related product ${index}`}
                  className="w-full h-auto object-cover"
                />
                <p className="text-gray-700 text-sm mt-2">Product Name</p>
                <p className="text-red-500 text-sm font-medium">Price</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
