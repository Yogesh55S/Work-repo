import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import UserProfile from "./Pages/UserProfile.jsx";
import AdminPanal from "./Pages/AdminPanal.jsx";
import ProductView from "./Component/admin/ProductView.jsx"; // Product view for admin
import Orders from "./Component/admin/Orders.jsx"; // Admin orders
import Settings from "./Component/admin/Settings.jsx"; // Admin settings

// Wrapper to check and exclude footer on admin routes
const AppWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-panel");

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/winter-collection" element={<WinterCollection />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/user-profile" element={<UserProfile />} />

        {/* Admin Panel */}
        <Route path="/admin-panel" element={<AdminPanal />}>
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="products" element={<ProductView />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <GoogleAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AppWrapper />
      </Router>
    </GoogleAuthProvider>
  );
}

export default App;
