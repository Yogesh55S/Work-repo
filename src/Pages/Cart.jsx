import React, { useState, useEffect } from "react";
import { useAuth } from "../Component/providers/AuthContext"; // Import AuthContext

const Cart = () => {
  const { cartCount, fetchCartCount } = useAuth(); // Fetch cart-related actions from AuthContext
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const items = await response.json();
        setCartItems(items);
      } else {
        throw new Error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update cart items after removal
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      fetchCartCount(); // Update cart count in context
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Adjust item quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      // Update quantity locally
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      fetchCartCount(); // Update cart count in context
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, [cartCount]);

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
          {cartItems.map((item) => (
            <tr key={item.productId} className="border-t">
              <td className="py-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span>{item.productName}</span>
                </div>
              </td>
              <td className="py-4">₹{item.price}</td>
              <td className="py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-4">₹{item.price * item.quantity}</td>
              <td className="py-4">
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-end">
        <p className="text-lg font-bold">
          Total: ₹
          {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </p>
      </div>
    </div>
  );
};

export default Cart;
