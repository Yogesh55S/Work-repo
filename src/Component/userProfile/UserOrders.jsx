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
    return <p className="p-4">No orders found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="border rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Order ID: {order._id}</h2>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <h3 className="text-lg font-semibold mt-4">Delivery Address</h3>
          <p>{order.address?.deliveryName || "N/A"}</p>
          <p>{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zip}, {order.address?.country}</p>
          <p><strong>Phone:</strong> {order.address?.deliveryNumber || "N/A"}</p>
          <h3 className="text-lg font-semibold mt-4">Items</h3>
          <ul className="list-disc ml-6">
            {order.items.map((item, index) => (
              <li key={index}>
                <span><strong>Product Name:</strong> {item.productId?.productName || "Unknown Product"}</span><br />
                <span><strong>Price:</strong> ₹{item.productId?.price || 0}</span><br />
                <span><strong>Quantity:</strong> {item.quantity}</span><br />
                <span><strong>Total:</strong> ₹{(item.productId?.price || 0) * item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold mt-4">Order Total: ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
