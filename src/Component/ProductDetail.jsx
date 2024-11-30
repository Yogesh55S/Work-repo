import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <div className="text-center text-gray-600">Product not found.</div>;
  }

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
  const mainImage = `${baseUrl}/${product.image.replace(/\\/g, "/")}`;
  const images = product.images || [mainImage];

  const [activeTab, setActiveTab] = useState("Description to Use");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }
        const data = await response.json();

        // Filter products based on type to show only related ones
        const filtered = data.filter(
          (item) =>
            item.type &&
            item.type.trim().toLowerCase() === product.type.trim().toLowerCase() &&
            item._id !== product._id
        );

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [baseUrl, product.type, product._id]);

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
                  onClick={() => setCurrentImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-[60%]">
            <h1 className="text-2xl mb-4">{product.productName}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-red-600 mb-4 text-lg">₹{product.price}</p>

            <div className="mt-4">
              <h3 className="text-[24px]  mb-2">Product Details</h3>
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

        {/* Tabs Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-wrap space-x-4 border-b pb-4 text-sm md:text-base">
            <button
              className={`px-4 py-2 ${
                activeTab === "Description to Use"
                  ? "bg-primary text-gray-800 border-b-2 border-button-primary"
                  : "bg-transparent text-gray-600"
              } rounded`}
              onClick={() => setActiveTab("Description to Use")}
            >
              Description to Use
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "Additional Information"
                  ? "bg-primary text-gray-800 border-b-2 border-button-primary"
                  : "bg-transparent text-gray-600"
              } rounded`}
              onClick={() => setActiveTab("Additional Information")}
            >
              Additional Information
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "Description to Use" && (
              <div>
                {/* <h3 className="text-lg  mb-4">Description to Use</h3> */}
                <p className="text-gray-700 text-sm">
                  {product.directionsToUse || "No information available for this product."}
                </p>
              </div>
            )}

            {activeTab === "Additional Information" && (
              <div>
                <h3 className="text-lg  mb-4">Related Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {relatedProducts.length > 0 ? (
                    relatedProducts.map((item) => (
                      <div
                        key={item._id}
                        className="shadow-lg p-4 rounded hover:shadow-xl transition cursor-pointer"
                        onClick={() => window.location.href = `/product/${item._id}`}
                      >
                        <img
                          src={`${baseUrl}/${item.image.replace(/\\/g, "/")}`}
                          alt={item.productName}
                          className="w-full h-40 object-cover mb-4"
                        />
                        <h4 className="text-gray-800 font-semibold">{item.productName}</h4>
                        <p className="text-gray-500">{item.type}</p>
                        <p className="text-red-600 font-bold">₹{item.price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No related products found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
