import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setUserRole(userData.role || "");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", userData.role || "");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("userRole");
  };

  const addToCart = (productId, quantity) => {
    const updatedCart = [...cart, { productId, quantity }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, userRole, cart, addToCart, logout, login, cartCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
