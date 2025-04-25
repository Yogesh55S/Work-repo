// AuthContext.js - Updated to match token storage in App.jsx
import React, { createContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import GuestCartService from "../../services/GuestCartService";
import PropTypes from "prop-types";

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

		// Transfer guest cart to user account
		if (GuestCartService.getCart().length > 0) {
			setTimeout(() => {
				transferGuestCartToUser && transferGuestCartToUser();
			}, 1000);
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
