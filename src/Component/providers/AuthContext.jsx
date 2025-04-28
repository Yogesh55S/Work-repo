import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useCart } from "./CartContext";
import GuestCartService from "../../services/GuestCartService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [userRole, setUserRole] = useState("");
	const [cart, setCart] = useState([]);

	const { transferGuestCartToUser } = useCart() || {};

	// Function to parse JWT token
	const parseJwt = (token) => {
		try {
			const base64Url = token.split(".")[1];
			const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split("")
					.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
					.join(""),
			);
			return JSON.parse(jsonPayload);
		} catch (e) {
			console.error("Error decoding token:", e);
			return null;
		}
	};

	// Function to log in the user
	const login = async (userData, authToken) => {
		setIsLoggedIn(true);
		setToken(authToken);
		setUser(userData);
		setUserRole(userData?.role || "");

		// Store in localStorage using the same key as App.jsx
		localStorage.setItem("authToken", authToken);

		// Transfer guest cart to user account immediately
		const guestCart = GuestCartService.getCart();
		if (guestCart && guestCart.length > 0 && userData?._id) {
			try {
				const API_URL = import.meta.env.VITE_API_URL;
				// Directly call the merge endpoint without setTimeout
				await GuestCartService.transferCartToUser(
					userData._id,
					authToken,
					API_URL,
				);

				// If transferGuestCartToUser callback exists, call it to update UI
				if (typeof transferGuestCartToUser === "function") {
					await transferGuestCartToUser();
				}
			} catch (error) {
				console.error("Failed to transfer guest cart:", error);
			}
		}
	};

	// Function to log out the user
	const logout = () => {
		setIsLoggedIn(false);
		setToken(null);
		setUser(null);
		setUserRole("");
		setCart([]);
		localStorage.removeItem("authToken");
	};

	// Ensure token and user data persist after a page refresh
	useEffect(() => {
		const storedToken = localStorage.getItem("authToken");

		if (storedToken) {
			const decodedToken = parseJwt(storedToken);

			if (decodedToken && decodedToken.userId) {
				setToken(storedToken);
				setUser({
					_id: decodedToken.userId,
					role: decodedToken.role || "user",
				});
				setUserRole(decodedToken.role || "user");
				setIsLoggedIn(true);
			} else {
				// Token is invalid or expired
				localStorage.removeItem("authToken");
			}
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn,
				token,
				user,
				userRole,
				login,
				logout,
				cart,
				setCart,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useAuth = () => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
