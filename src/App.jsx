import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import Home from './Pages/Home';
import WinterCollection from './Pages/WinterCollection';
import Shop from './Pages/Shop';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';

function App() {
  return (
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
