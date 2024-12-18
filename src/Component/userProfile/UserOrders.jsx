import React, { useEffect, useState } from "react";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched orders for user:", data);
          setOrders(data.orders || []);
        } else {
          console.error("Failed to fetch orders. Response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <p className="p-4 text-center text-gray-600">No orders found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg shadow-md mb-6 overflow-hidden bg-white"
        >
          {/* Order Header */}
          <div className="bg-[#8B5E3C] text-white p-4 flex justify-between items-center">
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

          {/* Delivery Section */}
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700 font-medium mb-2">
              <span className="font-semibold text-gray-800">Expected Delivery:</span> {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="flex items-center">
              <img
                src={order.items[0]?.productId?.image || "https://via.placeholder.com/100"}
                alt={order.items[0]?.productId?.productName || "Product Image"}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {order.items[0]?.productId?.productName || "Unknown Product"}
                </p>
                <p className="text-sm text-gray-600">Quantity: {order.items[0]?.quantity || 0}</p>
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-end bg-gray-100 p-3">
            <button
              className="border border-gray-600 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mr-2 hover:bg-gray-200"
            >
              VIEW YOUR ITEM
            </button>
            <button
              className="bg-[#8B5E3C] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6E422A]"
            >
              VIEW ORDER
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
