import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api"; // Import the utility function
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const UserOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // Base API URL
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || API_URL.replace("/api", ""); // Base URL for images
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchOrdersWithProductDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const data = await fetchWithAuth(`${API_URL}/orders/${userId}`, token);
        console.log("Fetched orders for user:", data);

        const ordersWithDetails = await Promise.all(
          data.orders.map(async (order) => {
            const itemsWithDetails = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const product = await fetchWithAuth(
                    `${API_URL}/products/${item.productId}`,
                    token
                  );
                  return { ...item, productDetails: product }; // Merge item with product details
                } catch (error) {
                  console.error(
                    `Error fetching product details for productId ${item.productId}:`,
                    error.message
                  );
                  return { ...item, productDetails: null };
                }
              })
            );
            return { ...order, items: itemsWithDetails };
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Error fetching orders or product details:", error.message);
      }
    };

    if (userId) {
      fetchOrdersWithProductDetails();
    }
  }, [API_URL, userId]);

  if (orders.length === 0) {
    return <p className="p-4 text-center text-gray-600">No orders found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-[#5C3822] rounded-lg  mb-6 overflow-hidden bg-white"
        >
          {/* Order Header */}
          <div className="bg-[#5C3822] text-white p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">ORDER PLACED</p>
              <p className="text-lg font-semibold">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">TOTAL</p>
              <p className="text-lg font-semibold">₹{order.totalAmount}</p>
            </div>
            <div>
              <p className="text-sm font-medium">ORDER ID</p>
              <p className="text-lg font-semibold">#{order._id}</p>
            </div>
          </div>

          {/* Single Item Display */}
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700 font-medium mb-2">
              <span className="font-semibold text-gray-800">Expected Delivery:</span> {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {order.items.length > 0 && (
              <div className="flex items-center mb-4">
                <img
                  src={
                    order.items[0].productDetails?.image
                      ? `${IMAGE_BASE_URL}/${order.items[0].productDetails.image.replace(/\\/g, "/")}`
                      : "https://via.placeholder.com/100"
                  }
                  alt={order.items[0].productDetails?.productName || "Product Image"}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-gray-800">
                    {order.items[0].productDetails?.productName || "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.items[0].quantity || 0}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    className="border border-gray-600 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200"
                    onClick={() => navigate(`/product/${order.items[0].productId}`)}
                  >
                    VIEW YOUR ITEM
                  </button>
                  <button
                    className="bg-[#B09383] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6E422A]"
                    onClick={() => navigate(`/user-panel/orders/${order._id}`)}
                  >
                    VIEW ORDER
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;