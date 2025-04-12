import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { CartContext } from "../Component/providers/CartContext";
import { useAuth } from "../Component/providers/AuthContext";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../Component/css/AddressBook.css";
import emptyCart from "../assets/svg/empty-cart.svg";
import CartSkeleton from "../Component/skeletons/Cartskeleton"; // Import the skeleton component

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [addresses, setAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [showAddAddressForm, setShowAddAddressForm] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [loading, setLoading] = useState(true); // Add loading state
	const [newAddress, setNewAddress] = useState({
		tag: "home",
		deliveryName: "",
		deliveryNumber: "",
		streetAddress: "",
		city: "",
		state: "",
		zip: "",
	});

	const navigate = useNavigate();
	const API_URL = import.meta.env.VITE_API_URL;
	const IMAGE_BASE_URL =
		import.meta.env.VITE_IMAGE_BASE_URL || API_URL.replace("/api", "");

	const { user } = useAuth();
	const userId = user?._id || localStorage.getItem("userId");

	// Persist userId in localStorage
	useEffect(() => {
		if (user?._id) {
			localStorage.setItem("userId", user._id);
		}
	}, [user]);

	// Check if user is logged in
	useEffect(() => {
		if (!userId) {
			console.warn("User ID is undefined, redirecting to login");
			navigate("/login");
			return;
		}
	}, [userId, navigate]);

	useEffect(() => {
		// Simple function to check if Cashfree SDK is available
		const checkCashfreeSDK = () => {
			if (window.Cashfree) {
				console.log("Cashfree SDK is available");
				return true;
			}
			return false;
		};

		// Check if SDK is already loaded
		if (checkCashfreeSDK()) {
			return;
		}

		// If not loaded, try to load it
		const script = document.createElement("script");
		script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
		script.async = true;
		script.onload = () => {
			console.log("Cashfree SDK script loaded");
			// Check again after script loads
			checkCashfreeSDK();
		};
		script.onerror = () => {
			console.error("Failed to load Cashfree SDK script");
		};
		document.body.appendChild(script);

		// Cleanup function
		return () => {
			// Remove any script elements we added
			const scripts = document.querySelectorAll(
				'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]',
			);
			scripts.forEach((script) => {
				if (script.parentNode) {
					script.parentNode.removeChild(script);
				}
			});
		};
	}, []); // Empty dependency array ensures this runs once when the component mounts

	const handleCheckout = async () => {
		if (!userId) {
			toast.info("Please log in to continue with checkout");
			navigate("/login");
			return;
		}

		if (!selectedAddress) {
			toast.info("Please select an address first!");
			return;
		}

		// Check if Cashfree SDK is available
		if (!window.Cashfree) {
			console.error("Cashfree SDK is not available at checkout time");
			alert("Payment system is not ready. Please try again in a moment.");
			return;
		}

		try {
			setIsProcessing(true);

			// Step 1: Create order on your backend
			const response = await fetch(`${API_URL}/orders/checkout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
				body: JSON.stringify({
					addressId: selectedAddress._id,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Checkout failed");
			}

			const data = await response.json();
			console.log("Checkout response data:", data);

			// Ensure Cashfree SDK is available
			if (window.Cashfree) {
				if (data.paymentSessionId) {
					// Store order ID in local storage for reference
					localStorage.setItem("currentOrderId", data.orderId);

					// Initialize Cashfree checkout
					const cashfree = window.Cashfree({
						mode: "sandbox", // or "production" for live environment
					});

					console.log(
						"Initializing Cashfree checkout with session ID:",
						data.paymentSessionId,
					);

					// Start Cashfree checkout
					cashfree
						.checkout({
							paymentSessionId: data.paymentSessionId,
							redirectTarget: "_self", // Redirect in the same tab
						})
						.then(() => {
							console.log("Cashfree checkout completed");
						})
						.catch((error) => {
							console.error("Error during Cashfree checkout:", error);
							throw new Error("Failed to complete payment");
						});
				} else {
					throw new Error("Invalid payment data received from server");
				}
			} else {
				throw new Error("Cashfree SDK is not loaded properly");
			}
		} catch (error) {
			console.error("❌ Error during checkout:", error.message);
			alert(`Checkout failed: ${error.message}`);
		} finally {
			setIsProcessing(false);
		}
	};

	const fetchCartItems = async () => {
		setLoading(true); // Start loading state
		try {
			// Add a small delay to show the skeleton (can be removed in production)
			if (import.meta.env.DEV) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}

			const response = await fetch(`${API_URL}/users/${userId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			if (response.ok) {
				const userData = await response.json();
				const cartWithDetails = await Promise.all(
					userData.cart.map(async (item) => {
						const productResponse = await fetch(
							`${API_URL}/products/${item.productId}`,
						);
						if (productResponse.ok) {
							const productData = await productResponse.json();
							return {
								...item,
								productDetails: productData,
							};
						}
						return item;
					}),
				);
				setCartItems(cartWithDetails);
			}
		} catch (error) {
			console.error("Error fetching cart items:", error.message);
			toast.error("Failed to load your cart items");
		} finally {
			setLoading(false); // End loading state
		}
	};

	const fetchAddresses = async () => {
		try {
			const response = await fetch(`${API_URL}/addresses/${userId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
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
				await fetchAddresses();
				setShowAddAddressForm(false);
			}
		} catch (error) {
			console.error("Error adding address:", error.message);
		}
	};

	// const updateQuantity = (productId, newQuantity) => {
	//   const updatedCart = cartItems.map((item) => {
	//     if (item.productDetails?._id === productId) {
	//       return { ...item, quantity: newQuantity };
	//     }
	//     return item;
	//   });
	//   setCartItems(updatedCart);
	// };
	const updateQuantity = async (productId, newQuantity) => {
		try {
			// First update local state for immediate feedback
			const updatedCart = cartItems.map((item) => {
				if (item.productDetails?._id === productId) {
					return { ...item, quantity: newQuantity };
				}
				return item;
			});
			setCartItems(updatedCart);

			// Then send update to backend
			const response = await fetch(`${API_URL}/cart/${userId}/update`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
				body: JSON.stringify({ productId, quantity: newQuantity }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to update cart");
			}

			// Optional: toast notification on success
			toast.success("Cart updated successfully");
		} catch (error) {
			console.error("Error updating cart quantity:", error.message);
			toast.error("Failed to update quantity");

			// Revert to previous state on error by re-fetching cart
			fetchCartItems();
		}
	};
	const calculateTotal = () => {
		const total = cartItems.reduce(
			(sum, item) => sum + (item.productDetails?.price || 0) * item.quantity,
			0,
		);
		setTotalAmount(total);
	};

	const { removeFromCart } = useContext(CartContext);

	const handleRemoveItem = async (productId) => {
		const success = await removeFromCart(userId, productId);
		if (success) {
			setCartItems(
				cartItems.filter((item) => item.productDetails._id !== productId),
			);
			toast.success("Item removed from cart");
		} else {
			toast.error("Failed to remove item from cart");
		}
	};

	useEffect(() => {
		if (!userId) {
			setCartItems([]);
			setLoading(false); // Also set loading to false when there's no user
			console.log("No User Id");
			return;
		}
		fetchCartItems();
		console.log("User Id: " + userId);
	}, [userId]);

	useEffect(() => {
		calculateTotal();
	}, [cartItems]);

	return (
		<div className="container mx-auto p-4 pt-28">
			<h1 className="text-2xl font-bold mb-5">Your Cart</h1>

			{/* Show skeleton while loading */}
			{loading ? (
				<CartSkeleton />
			) : cartItems.length === 0 ? (
				<div className="flex flex-col items-center justify-center">
					<img src={emptyCart} alt="empty-cart" />
					<h4>Nothing Here Yet!</h4>
					<p className="text-gray-500">
						Browse our collections and find something special.
					</p>
				</div>
			) : (
				<div className="flex flex-col lg:flex-row items-center gap-5">
					{/* Cart Items */}
					<div className="flex-1 space-y-4 w-full">
						{cartItems.map((item) => (
							<div
								key={item.productDetails?._id}
								className="flex items-start border-b-2 p-4 sm:p-2"
							>
								<img
									src={
										item.productDetails?.image
											? `${IMAGE_BASE_URL}/${item.productDetails.image.replace(
													/\\/g,
													"/",
												)}`
											: "https://via.placeholder.com/100"
									}
									alt={item.productDetails?.productName || "Product"}
									className="md:w-24 md:h-24 sm:w-32 sm:h-32 object-cover mr-4"
								/>
								<div className="flex-1">
									<div className="flex justify-between md:items-center">
										<h3 className="font-semibold text-sm sm:text-base md:text-lg">
											{item.productDetails?.productName || "Unknown Product"}
										</h3>
										<p className="text-gray-700 font-medium text-base mt-10 md:mt-0">
											₹{item.productDetails?.price || 0}
										</p>
									</div>

									<div className="mt-2 flex items-center gap-2">
										<label htmlFor="qty" className="text-sm text-gray-600">
											Qty:
										</label>
										<select
											value={item.quantity}
											onChange={(e) =>
												updateQuantity(
													item.productDetails?._id,
													parseInt(e.target.value, 10),
												)
											}
											className="border rounded px-2 py-1"
										>
											{[...Array(10)].map((_, i) => (
												<option key={i + 1} value={i + 1}>
													{i + 1}
												</option>
											))}
										</select>
									</div>

									<div className="mt-2 text-sm text-red-600 flex gap-4">
										<button
											onClick={() => handleRemoveItem(item.productDetails?._id)}
										>
											Remove Item
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Order Summary */}
					<div className="w-[350px] h-[132px] bg-gray-100 p-4 rounded-lg sticky top-6 lg:self-start">
						<div className="text-xl font-semibold flex justify-between">
							<span>Subtotal ({cartItems.length} items):</span>
							<span className="text-black font-bold">₹{totalAmount}</span>
						</div>
						<div className="flex justify-center mt-6">
							<button
								onClick={() => {
									fetchAddresses();
									setShowAddressModal(true);
								}}
								className="brown-deep-button"
								style={{ width: "100%" }}
								disabled={isProcessing}
							>
								{isProcessing ? "Processing..." : "Proceed to Buy"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Address Modal */}
			{showAddressModal && (
				<div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
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
										className={`border p-4 rounded flex items-center gap-4 ${
											selectedAddress?._id === address._id
												? "border-blue-500 bg-blue-50"
												: ""
										}`}
									>
										<input
											type="radio"
											name="address"
											id={`address-${address._id}`}
											value={address._id}
											checked={selectedAddress?._id === address._id}
											onChange={() => setSelectedAddress(address)}
										/>
										<label
											htmlFor={`address-${address._id}`}
											className="flex-1 cursor-pointer"
										>
											<p className="font-bold">{address.deliveryName}</p>
											<p className="text-sm">
												{address.streetAddress}, {address.city}, {address.state}{" "}
												- {address.zip}
											</p>
											<p className="text-sm">{address.deliveryNumber}</p>
										</label>
									</div>
								))}
							</div>
						) : (
							<p>No saved addresses. Please add one.</p>
						)}

						<div className="flex gap-4 mt-4">
							<button
								onClick={() => setShowAddAddressForm(true)}
								className="brown-deep-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
							>
								Add Address
							</button>
							<button
								onClick={handleCheckout}
								disabled={!selectedAddress || isProcessing}
								className={`brown-deep-button ${
									selectedAddress && !isProcessing
										? "bg-blue-500 hover:bg-blue-600 text-white"
										: "bg-gray-300 cursor-not-allowed text-gray-600"
								} px-4 py-2 rounded`}
							>
								{isProcessing ? "Processing..." : "Proceed to Payment"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add Address Form */}
			{showAddAddressForm && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h3 className="modal-title">Add New Address</h3>
						<div className="modal-grid">
							<div className="form-group full-width">
								<label>Name *</label>
								<input
									type="text"
									name="deliveryName"
									value={newAddress.deliveryName}
									onChange={(e) =>
										setNewAddress({
											...newAddress,
											deliveryName: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="form-group full-width">
								<label>Mobile Number *</label>
								<input
									type="text"
									name="deliveryNumber"
									value={newAddress.deliveryNumber}
									onChange={(e) =>
										setNewAddress({
											...newAddress,
											deliveryNumber: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="form-group full-width">
								<label>Street Address *</label>
								<input
									type="text"
									name="streetAddress"
									value={newAddress.streetAddress}
									onChange={(e) =>
										setNewAddress({
											...newAddress,
											streetAddress: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="form-group">
								<label>City *</label>
								<input
									type="text"
									name="city"
									value={newAddress.city}
									onChange={(e) =>
										setNewAddress({ ...newAddress, city: e.target.value })
									}
									required
								/>
							</div>
							<div className="form-group">
								<label>State *</label>
								<input
									type="text"
									name="state"
									value={newAddress.state}
									onChange={(e) =>
										setNewAddress({ ...newAddress, state: e.target.value })
									}
									required
								/>
							</div>
							<div className="form-group">
								<label>ZIP *</label>
								<input
									type="text"
									name="zip"
									value={newAddress.zip}
									onChange={(e) =>
										setNewAddress({ ...newAddress, zip: e.target.value })
									}
									required
								/>
							</div>
							<div className="form-group">
								<label>Tag *</label>
								<select
									name="tag"
									value={newAddress.tag}
									onChange={(e) =>
										setNewAddress({ ...newAddress, tag: e.target.value })
									}
								>
									<option value="home">Home</option>
									<option value="work">Work</option>
									<option value="other">Other</option>
								</select>
							</div>
						</div>
						<div className="modal-actions">
							<button
								onClick={() => setShowAddAddressForm(false)}
								className="cancel-btn"
							>
								CANCEL
							</button>
							<button onClick={handleAddAddress} className="save-btn">
								SAVE
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

Cart.propTypes = {
	userId: PropTypes.string,
};

export default Cart;
