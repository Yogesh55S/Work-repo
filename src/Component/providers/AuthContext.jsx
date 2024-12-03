import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  
  // Cart state
  const [cartCount, setCartCount] = useState(0);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user with role
    localStorage.setItem("token", userData.token); // Save token for API calls
    fetchCartCount(); // Fetch cart count after login
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Fetch cart count from backend
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const cart = await response.json();
        setCartCount(cart.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // Add to cart function
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to your cart.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart.");
      }

      setCartCount((prev) => prev + quantity); // Update cart count locally
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  // Fetch cart count on component mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        userRole: user?.role || "",
        cartCount,
        addToCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
