import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import GoogleAuthProvider from "./Component/providers/GoogleAuthProvider.jsx";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Home from "./Pages/Home";
import WinterCollection from "./Pages/WinterCollection";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import VerifyOTP from "./Pages/VerifyOtp.jsx";
import ProductDetail from "./Component/ProductDetail.jsx";
import AddProductForm from "./Component/admin/AddProductForm.jsx";
import AdminPanal from "./Pages/AdminPanal.jsx";
import ProductView from "./Component/admin/ProductView.jsx"; // Product view for admin
import Orders from "./Component/admin/Orders.jsx"; // Admin orders
import Settings from "./Component/admin/Settings.jsx"; // Admin settings
import UserPanel from "./Pages/UserPanel.jsx"; // User Panel (like Admin Panel)
import PersonalInformation from "./Component/userProfile/PersonalInformation.jsx"; // Personal Information component
import AddressBook from "./Component/userProfile/AddressBook.jsx"; // Address Book component
import UserOrders from "./Component/userProfile/UserOrders.jsx"; // Orders component for user
import OrderDetails from "./Component/userProfile/OrderDetails.jsx"; // Orders component for user
import Payment from "./Component/userProfile/Payment.jsx"; // Payment component for user
import Security from "./Component/userProfile/Security.jsx"; // Security component for user
import HelpSupport from "./Component/userProfile/HelpSupport.jsx"; // Help & Support component for user

// Create AuthContext
export const AuthContext = createContext();

// Wrapper to check and exclude footer on admin and user-panel routes
const AppWrapper = ({ user }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-panel");
  const isUserPanelRoute = location.pathname.startsWith("/user-panel");

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/winter-collection" element={<WinterCollection />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart userId={user?.userId} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Admin Panel */}
        <Route path="/admin-panel" element={<AdminPanal />}>
          <Route index element={<AddProductForm />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="products" element={<ProductView />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* User Panel */}
        <Route path="/user-panel" element={<UserPanel />}>
          <Route index element={<PersonalInformation />} />
          <Route path="profile" element={<PersonalInformation />} />
          <Route path="address-book" element={<AddressBook />} />
          <Route path="orders" element={<UserOrders userId={user?.userId} />} />
          <Route path="orders/:id" element={<OrderDetails/>} />
          <Route path="payment" element={<Payment />} />
          <Route path="security" element={<Security />} />
          <Route path="help-support" element={<HelpSupport />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    console.log("Stored Token:", storedToken); // Log the raw token
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = parseJwt(storedToken);
      console.log("Decoded Token:", decodedToken); // Log the decoded payload
      if (decodedToken?.userId) {
        console.log("Decoded User ID:", decodedToken.userId); // Confirm userId
        setUser({ userId: decodedToken.userId });
      } else {
        console.error("User ID not found in token payload.");
      }
    } else {
      console.error("No token found in localStorage.");
    }
  }, []);

  // Helper function to decode JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) throw new Error("Invalid token format.");
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e.message);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    console.log("User logged out and localStorage cleared.");
  };

  return (
    <AuthContext.Provider value={{ user, token, logout }}>
      <GoogleAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <AppWrapper user={user} />
        </Router>
      </GoogleAuthProvider>
    </AuthContext.Provider>
  );
}

export default App;
