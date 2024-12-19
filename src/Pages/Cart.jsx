import React, { useState, useEffect } from "react";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    tag: "home",
    deliveryName: "",
    deliveryNumber: "",
    houseNumber: "",
    city: "",
    state: "",
    zip: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || API_URL.replace("/api", "");

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (response.ok) {
        const userData = await response.json();
        const cartWithDetails = await Promise.all(
          userData.cart.map(async (item) => {
            const productResponse = await fetch(
              `${API_URL}/products/${item.productId}`
            );
            if (productResponse.ok) {
              const productData = await productResponse.json();
              return {
                ...item,
                productDetails: productData,
              };
            }
            return item;
          })
        );
        setCartItems(cartWithDetails);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/addresses/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error.message);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch(`${API_URL}/addresses/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newAddress),
      });
      if (response.ok) {
        const addedAddress = await response.json();
        setAddresses((prev) => [...prev, addedAddress]);
        setShowAddAddressForm(false);
      }
    } catch (error) {
      console.error("Error adding address:", error.message);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.productDetails?._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.productDetails?.price || 0) * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select an address first!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId,
          addressId: selectedAddress._id,
          cart: cartItems.map((item) => ({
            productId: item.productDetails?._id,
            quantity: item.quantity,
          })),
        }),
      });
      if (response.ok) {
        alert("Order placed successfully!");
        setCartItems([]);
        setShowAddressModal(false);
      }
    } catch (error) {
      console.error("Error during order creation:", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  return (
    <div className="container mx-auto p-4 pt-28">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Cart Items */}
          <div className="flex-1">
            <table className="w-full text-left table-auto mb-4 border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Product</th>
                  <th className="border-b p-2">Price</th>
                  <th className="border-b p-2">Quantity</th>
                  <th className="border-b p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productDetails?._id}>
                    <td className="p-2">
                      <div className="flex items-center">
                        <img
                          src={
                            item.productDetails?.image
                              ? `${IMAGE_BASE_URL}/${item.productDetails.image.replace(/\\/g, "/")}`
                              : "https://via.placeholder.com/100"
                          }
                          alt={item.productDetails?.productName || "Product"}
                          className="w-16 h-16 object-cover mr-4"
                        />
                        <span>{item.productDetails?.productName || "Unknown Product"}</span>
                      </div>
                    </td>
                    <td className="p-2">₹{item.productDetails?.price || 0}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productDetails?._id, parseInt(e.target.value, 10))
                        }
                        className="border w-16 text-center"
                      />
                    </td>
                    <td className="p-2">
                      ₹{(item.productDetails?.price || 0) * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Checkout Section */}
          <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="mb-4">
              <p className="text-gray-600">Subtotal</p>
              <p className="text-3xl font-bold">₹{totalAmount}</p>
            </div>
            <button
              onClick={() => {
                fetchAddresses();
                setShowAddressModal(true);
              }}
              className="w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-3 right-3 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Select an Address</h2>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="border p-4 rounded flex items-center gap-4"
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address._id}
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                    />
                    <div>
                      <p className="font-bold">{address.deliveryName}</p>
                      <p className="text-sm">
                        {address.houseNumber}, {address.city}, {address.state} - {address.zip}
                      </p>
                      <p className="text-sm">{address.deliveryNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses. Please add one.</p>
            )}

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowAddAddressForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Address
              </button>
              <button
                onClick={handleCheckout}
                disabled={!selectedAddress}
                className={`px-4 py-2 rounded-md font-bold text-white ${
                  selectedAddress ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Form */}
      {showAddAddressForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>
            <div className="space-y-4">
              <select
                value={newAddress.tag}
                onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                className="border w-full p-2 rounded"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                value={newAddress.deliveryName}
                onChange={(e) => setNewAddress({ ...newAddress, deliveryName: e.target.value })}
                className="border w-full p-2 rounded"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={newAddress.deliveryNumber}
                onChange={(e) => setNewAddress({ ...newAddress, deliveryNumber: e.target.value })}
                className="border w-full p-2 rounded"
              />
              <input
                type="text"
                placeholder="House Number"
                value={newAddress.houseNumber}
                onChange={(e) => setNewAddress({ ...newAddress, houseNumber: e.target.value })}
                className="border w-full p-2 rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="border w-full p-2 rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="border w-full p-2 rounded"
              />
              <input
                type="text"
                placeholder="ZIP"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                className="border w-full p-2 rounded"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleAddAddress}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setShowAddAddressForm(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;