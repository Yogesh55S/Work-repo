import React from "react";
import { useLocation } from "react-router-dom";
import RelatedProducts from "./RelatedProducts"; // Import RelatedProducts component

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <div className="text-center text-gray-600">Product not found.</div>;
  }

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
  const mainImage = `${baseUrl}/${product.image.replace(/\\/g, "/")}`;
  const images = product.images || [mainImage];

  return (
    <div className="max-w-full mx-auto p-4 pt-28">
      <div className="container mx-auto lg:w-[1240px]">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
          {/* Product Image */}
          <div className="w-full md:w-[40%]">
            <img src={mainImage} alt="Product" className="w-full h-auto object-cover shadow" />
            <div className="flex mt-4 space-x-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className={`w-16 h-16 object-cover shadow cursor-pointer ${
                    mainImage === img ? "ring-2 ring-button-primary" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-[60%]">
            <h1 className="text-2xl mb-4">{product.productName}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-green-600 mb-4 text-lg">₹{product.price}</p>

            <div className="mt-4">
              <h3 className="text-[24px] mb-2">Product Details</h3>
              <ul className="text-gray-600 text-[16px]">
                {product.netQuantity && (
                  <li>
                    <strong>Net Quantity:</strong> {product.netQuantity}
                  </li>
                )}
                {product.allergenInformation && (
                  <li>
                    <strong>Allergen Information:</strong> {product.allergenInformation}
                  </li>
                )}
                {product.directionsToUse && (
                  <li>
                    <strong>Directions to Use:</strong> {product.directionsToUse}
                  </li>
                )}
                {product.useBefore && (
                  <li>
                    <strong>Use Before:</strong> {product.useBefore}
                  </li>
                )}
                {product.type && (
                  <li>
                    <strong>Type:</strong> {product.type}
                  </li>
                )}
                {product.subType && (
                  <li>
                    <strong>Sub-Type:</strong> {product.subType}
                  </li>
                )}
              </ul>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => alert("Added to cart!")}
              className="mt-6 px-6 py-2 bg-button-primary text-white font-medium text-sm md:text-base shadow hover:bg-primary transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts
          productType={product.type}
       
        />
      </div>
    </div>
  );
};

export default ProductDetail;
