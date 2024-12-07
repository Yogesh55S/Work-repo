import React, { useState, useEffect } from "react";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [extractedUserId, setExtractedUserId] = useState(userId);

  const decodeJWT = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = atob(payloadBase64);
      return JSON.parse(payload);
    } catch (error) {
      console.error("Failed to decode token:", error.message);
      return null;
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${extractedUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const items = await response.json();
        setCartItems(items);
      } else {
        console.error("Failed to fetch cart items. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${extractedUserId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId._id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity. Status:", response.status);
      }
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${extractedUserId}/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.productId._id !== productId));
      } else {
        console.error("Failed to remove item. Status:", response.status);
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: extractedUserId,
          cart: cartItems.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = data.paymentUrl;
        } else {
          console.error("Payment URL not received.");
        }
      } else {
        console.error("Failed to initiate checkout. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  useEffect(() => {
    if (!userId) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded?.userId) {
          setExtractedUserId(decoded.userId);
        }
      }
    }
  }, [userId]);

  useEffect(() => {
    if (extractedUserId) fetchCartItems();
  }, [extractedUserId]);

  if (!extractedUserId) {
    return (
      <div className="container mx-auto p-4 pt-28 text-center">
        <h1 className="text-2xl font-bold">Please log in to view your cart.</h1>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 pt-28 text-center">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-gray-500 mt-4">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-28">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="border-b pb-2">Product</th>
            <th className="border-b pb-2">Price</th>
            <th className="border-b pb-2">Quantity</th>
            <th className="border-b pb-2">Total</th>
            <th className="border-b pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
            const imageUrl = `${baseUrl}/${item.productId.image?.replace(/\\/g, "/")}`;

            return (
              <tr key={item.productId._id} className="border-t">
                <td className="py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={imageUrl}
                      alt={item.productId.productName || "Product Image"}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = "/path/to/placeholder-image.png")} // Fallback image
                    />
                    <span>{item.productId.productName}</span>
                  </div>
                </td>
                <td className="py-4">₹{item.productId.price}</td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4">₹{item.productId.price * item.quantity}</td>
                <td className="py-4">
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-bold">
          Total: ₹
          {cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0)}
        </p>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
