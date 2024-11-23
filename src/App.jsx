import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAuthProvider from './Component/providers/GoogleAuthProvider.jsx'; // Import the custom provider
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import Home from './Pages/Home';
import WinterCollection from './Pages/WinterCollection';
import Shop from './Pages/Shop';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx'; // Register Page
import VerifyOTP from './Pages/VerifyOtp.jsx'; // Verify OTP Page

function App() {
  return (
    <GoogleAuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home Page */}
            <Route path="/winter-collection" element={<WinterCollection />} /> {/* Winter Collection Page */}
            <Route path="/shop" element={<Shop />} /> {/* Shop Page */}
            <Route path="/contact" element={<Contact />} /> {/* Contact Page */}
            <Route path="/cart" element={<Cart />} /> {/* Cart Page */}
            <Route path="/profile" element={<Profile />} /> {/* Profile Page */}
            <Route path="/login" element={<Login />} /> {/* Login Page */}
            <Route path="/register" element={<Register />} /> {/* Register Page */}
            <Route path="/verify-otp" element={<VerifyOTP />} /> {/* Verify OTP Page */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </GoogleAuthProvider>
  );
}

export default App;
