import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useCart } from "./CartContext";
import GuestCartService from "../../services/GuestCartService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Function to validate token with backend
  const validateToken = async (authToken) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error("Token validation failed:", error);
      return null;
    }
  };

  // Function to log in the user
  const login = async (userData, authToken) => {
    try {
      setIsLoggedIn(true);
      setToken(authToken);
      setUser(userData);
      setUserRole(userData?.role || "user");

      // Store in localStorage - keeping both for compatibility
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set default authorization header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      // Transfer guest cart to user account immediately
      const guestCart = GuestCartService.getCart();
      if (guestCart && guestCart.length > 0 && (userData?.id || userData?._id)) {
        try {
          const userId = userData.id || userData._id;
          const API_URL = import.meta.env.VITE_API_URL;
          
          // Transfer cart to user account
          await GuestCartService.transferCartToUser(
            userId,
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

      console.log("User logged in successfully in context");
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      // Optional: Call logout endpoint
      if (token) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Logout endpoint error:", error);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of endpoint success
      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
      setUserRole("");
      setCart([]);

      // Clear localStorage - remove both keys for compatibility
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];

      console.log("User logged out successfully");
    }
  };

  // Function to update user data
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    setUserRole(updatedUserData?.role || "user");
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  // Helper functions
  const isAuthenticated = () => {
    return isLoggedIn && !!token && !!user;
  };

  const hasRole = (role) => {
    return userRole === role || user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored token (try both keys for compatibility)
        const storedToken = localStorage.getItem("authToken") || localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          // First try to parse stored user data
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              
              // Validate token with backend
              const validatedUser = await validateToken(storedToken);
              
              if (validatedUser) {
                setToken(storedToken);
                setUser(validatedUser);
                setUserRole(validatedUser.role || "user");
                setIsLoggedIn(true);
                
                // Set default authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                
                console.log("Auth restored from localStorage");
              } else {
                // Token is invalid, clear storage
                localStorage.removeItem("authToken");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              }
            } catch (parseError) {
              console.error("Error parsing stored user data:", parseError);
              localStorage.removeItem("user");
            }
          } else {
            // Fallback: decode token manually (for backward compatibility)
            const decodedToken = parseJwt(storedToken);

            if (decodedToken && decodedToken.userId) {
              // Validate with backend
              const validatedUser = await validateToken(storedToken);
              
              if (validatedUser) {
                setToken(storedToken);
                setUser(validatedUser);
                setUserRole(validatedUser.role || "user");
                setIsLoggedIn(true);
                
                // Set default authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                
                // Store user data for future use
                localStorage.setItem("user", JSON.stringify(validatedUser));
              } else {
                // Token is invalid or expired
                localStorage.removeItem("authToken");
                localStorage.removeItem("token");
              }
            } else {
              // Token is invalid
              localStorage.removeItem("authToken");
              localStorage.removeItem("token");
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up axios interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          console.log("Token expired, logging out...");
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const contextValue = {
    // State
    isLoggedIn,
    token,
    user,
    userRole,
    cart,
    loading,
    
    // Functions
    login,
    logout,
    updateUser,
    setCart,
    
    // Helper functions
    isAuthenticated,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
