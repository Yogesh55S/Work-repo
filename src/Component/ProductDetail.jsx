import React from "react";
import { useLocation } from "react-router-dom";
import RelatedProducts from "./RelatedProducts";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <div className="text-center text-gray-600">Product not found.</div>;
  }

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
  const mainImage = `${baseUrl}/${product.image.replace(/\\/g, "/")}`;
  const images = product.images || [mainImage];

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userId = user?._id;
  
    if (!token || !userId) {
      alert("You need to log in to add items to the cart.");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
  
      if (response.ok) {
        const updatedCart = await response.json();
        console.log("Item added to cart:", updatedCart);
        alert("Product added to cart successfully!");
      } else {
        console.error("Failed to add item to cart. Status:", response.status);
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert("An error occurred while adding the product to the cart.");
    }
  };
  

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
            <h1 className="text-2xl mb-4 font-bold">{product.productName}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-green-600 mb-4 text-lg font-semibold">₹{product.price}</p>

            {/* Product Attributes */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Product Details</h3>
              <ul className="text-gray-600 text-base list-disc ml-5">
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
              onClick={handleAddToCart}
              className="mt-6 px-6 py-2 bg-button-primary text-white font-medium text-sm md:text-base shadow hover:bg-primary transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <RelatedProducts productType={product.type} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
