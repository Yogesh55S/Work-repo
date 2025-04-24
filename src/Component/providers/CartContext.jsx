import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import GuestCartService from "../../services/GuestCartService";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartCount, setCartCount] = useState(0);
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const { isLoggedIn, user } = useAuth();
	const API_URL = import.meta.env.VITE_API_URL;

	// Use useCallback to memoize the function to prevent unnecessary re-renders
	const updateCartCount = useCallback(
		async (userId) => {
			setLoading(true);
			try {
				if (isLoggedIn && userId) {
					// For authenticated users - fetch from API
					const token = localStorage.getItem("token");

					// First try the dedicated cart count endpoint
					try {
						const response = await fetch(`${API_URL}/cart/${userId}/count`, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});

						if (response.ok) {
							const data = await response.json();
							setCartCount(data.count);
							setLoading(false);
							return;
						}
					} catch (error) {
						// Silently catch errors with the first approach and continue to fallback
						console.log("Using fallback method for cart count", error);
					}

					// Fallback to fetching user data
					try {
						const response = await fetch(`${API_URL}/users/${userId}`, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});

						if (response.ok) {
							const data = await response.json();
							// Check if data.cart exists before trying to reduce
							if (data.cart && Array.isArray(data.cart)) {
								const totalItems = data.cart.reduce(
									(total, item) => total + item.quantity,
									0,
								);
								setCartCount(totalItems);
							} else {
								// If cart property doesn't exist or isn't an array, set count to 0
								setCartCount(0);
							}
						} else {
							// If user fetch fails, set count to 0
							setCartCount(0);
						}
					} catch (error) {
						console.error("Failed to fetch user data for cart count:", error);
						setCartCount(0);
					}
				} else {
					// For guest users - get from localStorage
					const count = GuestCartService.getCartCount();
					setCartCount(count);
				}
			} catch (error) {
				console.error("Failed to fetch cart count:", error);
				// Don't leave the count in an inconsistent state
				if (!isLoggedIn) {
					setCartCount(GuestCartService.getCartCount());
				}
			} finally {
				setLoading(false);
			}
		},
		[isLoggedIn, API_URL],
	); // Only recreate when these dependencies change

	const addToCart = async (product, quantity = 1) => {
		try {
			if (isLoggedIn && user?._id) {
				// For authenticated users
				const token = localStorage.getItem("token");
				const response = await fetch(`${API_URL}/cart/${user._id}/add`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId: product._id, quantity }),
				});

				if (response.ok) {
					await updateCartCount(user._id);
					return true;
				}
				return false;
			} else {
				// For guest users
				const success = GuestCartService.addToCart(product, quantity);
				if (success) {
					await updateCartCount(null);
				}
				return success;
			}
		} catch (error) {
			console.error("Failed to add item to cart:", error);
			return false;
		}
	};

	const removeFromCart = async (userId, productId) => {
		try {
			if (isLoggedIn && userId) {
				// For authenticated users
				const token = localStorage.getItem("token");
				const response = await fetch(`${API_URL}/cart/${userId}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId }),
				});

				if (response.ok) {
					await updateCartCount(userId);
					return true;
				}
				return false;
			} else {
				// For guest users
				const success = GuestCartService.removeFromCart(productId);
				if (success) {
					await updateCartCount(null);
				}
				return success;
			}
		} catch (error) {
			console.error("Failed to remove item from cart:", error);
			return false;
		}
	};

	const updateCartItemQuantity = async (userId, productId, quantity) => {
		try {
			if (isLoggedIn && userId) {
				// For authenticated users
				const token = localStorage.getItem("token");
				const response = await fetch(`${API_URL}/cart/${userId}/update`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId, quantity }),
				});

				if (response.ok) {
					await updateCartCount(userId);
					return true;
				}
				return false;
			} else {
				// For guest users
				const success = GuestCartService.updateQuantity(productId, quantity);
				if (success) {
					await updateCartCount(null);
				}
				return success;
			}
		} catch (error) {
			console.error("Failed to update cart quantity:", error);
			return false;
		}
	};

	// Transfer guest cart to user account after login
	const transferGuestCartToUser = async () => {
		if (isLoggedIn && user?._id && GuestCartService.getCart().length > 0) {
			const token = localStorage.getItem("token");
			const success = await GuestCartService.transferCartToUser(
				user._id,
				token,
				API_URL,
			);
			if (success) {
				await updateCartCount(user._id);
			}
			return success;
		}
		return false;
	};

	// Modified useEffect to prevent infinite loops
	useEffect(() => {
		// Only run this when authentication state truly changes
		const userId = user?._id;

		// Create a flag to track whether component is mounted
		let isMounted = true;

		const fetchCartData = async () => {
			// Only update state if component is still mounted
			if (isMounted) {
				await updateCartCount(userId);
			}
		};

		fetchCartData();

		// Cleanup function to prevent updates if component unmounts during async operation
		return () => {
			isMounted = false;
		};
	}, [isLoggedIn, user?._id, updateCartCount]); // Add updateCartCount to dependencies

	return (
		<CartContext.Provider
			value={{
				cartCount,
				loading,
				addToCart,
				removeFromCart,
				updateCartCount,
				updateCartItemQuantity,
				transferGuestCartToUser,
				cartItems,
				setCartItems,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

CartProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
