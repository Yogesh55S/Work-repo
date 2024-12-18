import React, { useState, useEffect } from "react";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [extractedUserId, setExtractedUserId] = useState(userId);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    deliveryName: "",
    deliveryNumber: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    tag: "home", // Default tag added
  });

  // Decode JWT
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

  // Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${extractedUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) setCartItems(await response.json());
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  // Fetch Addresses
  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/addresses/${extractedUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error.message);
    }
  };

  // Add New Address
  const handleAddAddress = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/addresses/${extractedUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAddress),
      });
      if (response.ok) {
        const addedAddress = await response.json();
        setAddresses((prev) => [...prev, addedAddress]);
        setNewAddress({
          deliveryName: "",
          deliveryNumber: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          tag: "home", // Reset to default tag
        });
        setShowAddAddressForm(false);
      } else {
        const errorData = await response.json();
        console.error("Error adding address:", errorData.message);
      }
    } catch (error) {
      console.error("Error adding address:", error.message);
    }
  };

  // Place Order
  const handleOrderCreation = async () => {
    if (!selectedAddress) {
      alert("Please select an address first!");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: extractedUserId,
          addressId: selectedAddress._id,
          cart: cartItems.map((item) => ({
            productId: item.productId._id,
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
    if (!userId) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded?.userId) setExtractedUserId(decoded.userId);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (extractedUserId) fetchCartItems();
  }, [extractedUserId]);

  return (
    <div className="container mx-auto p-4 pt-28">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full text-left table-auto mb-4">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId._id}>
                  <td>{item.productId.productName}</td>
                  <td>₹{item.productId.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.productId.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-lg font-bold">
            Total: ₹
            {cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0)}
          </p>

          <button
            onClick={() => {
              fetchAddresses();
              setShowAddressModal(true);
            }}
            className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Select an Address</h2>

            {addresses.length > 0 ? (
              <div className="address-section">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`address-card ${selectedAddress?._id === address._id ? "selected" : ""}`}
                  >
                    <div className="address-details">
                      <p className="address-title">{address.deliveryName}</p>
                      <p>
                        {address.street}, {address.city}, {address.state} - {address.zip}, {address.country}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {address.deliveryNumber}
                      </p>
                    </div>
                    <div className="address-actions">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddress?._id === address._id}
                        onChange={() => setSelectedAddress(address)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses found. Please add a new address below.</p>
            )}

            <button
              onClick={() => setShowAddAddressForm(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add New Address
            </button>

            <button
              onClick={handleOrderCreation}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!selectedAddress}
            >
              Confirm and Place Order
            </button>

            <button
              onClick={() => setShowAddressModal(false)}
              className="mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAddAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>

            <div className="modal-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="deliveryName"
                  value={newAddress.deliveryName}
                  onChange={(e) => setNewAddress({ ...newAddress, deliveryName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="text"
                  name="deliveryNumber"
                  value={newAddress.deliveryNumber}
                  onChange={(e) => setNewAddress({ ...newAddress, deliveryNumber: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Street *</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>ZIP *</label>
                <input
                  type="text"
                  name="zip"
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tag *</label>
                <select
                  name="tag"
                  value={newAddress.tag}
                  onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddAddress}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Address
            </button>

            <button
              onClick={() => setShowAddAddressForm(false)}
              className="mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
