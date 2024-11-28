import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './providers/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef();
  const { isLoggedIn, logout, userRole, user } = useAuth();  // Get userRole and user from AuthContext

  console.log('Navbar rendered. isLoggedIn:', isLoggedIn);
  console.log('User role:', userRole);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout(); // Call logout function from Auth context
    navigate('/login'); // Redirect to login page after logout
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      // Check the user role and navigate accordingly
      if (userRole.trim().toLowerCase() === 'admin') {
        navigate('/admin-panel'); // Redirect to admin panel if user is an admin
      } else {
        navigate('/user-profile'); // Redirect to user profile if user is not an admin
      }
    } else {
      navigate('/login'); // Navigate to login if not logged in
    }
  };

  return (
    <nav className="bg-primary h-20 flex items-center fixed w-full z-50 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link to="/">Nidas Pure</Link>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && !isDesktop && (
            <motion.ul
              ref={menuRef}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-4 fixed top-20 left-0 bg-[#B09383] w-full py-4 lg:hidden z-50 shadow-lg"
            >
              {[{ name: 'Home', path: '/' }, { name: 'Winter Collection', path: '/winter-collection' }, { name: 'Shop', path: '/shop' }, { name: 'Contact Us', path: '/contact' }].map((navItem) => (
                <li key={navItem.path} className="list-none px-4">
                  <Link
                    to={navItem.path}
                    className={`hover:text-[#D7C9C1] text-white text-[13px] font-medium uppercase ${isActive(navItem.path) ? 'text-[#D7C9C1]' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Desktop Menu */}
        {isDesktop && (
          <ul className="hidden lg:flex lg:space-x-6 lg:items-center lg:static text-white text-[13px] font-medium uppercase lg:ml-16">
            {[{ name: 'Home', path: '/' }, { name: 'Winter Collection', path: '/winter-collection' }, { name: 'Shop', path: '/shop' }, { name: 'Contact Us', path: '/contact' }].map((navItem) => (
              <li key={navItem.path} className="list-none px-4">
                <Link
                  to={navItem.path}
                  className={`hover:text-[#D7C9C1] ${isActive(navItem.path) ? 'text-[#D7C9C1]' : ''}`}
                >
                  {navItem.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* User Controls */}
        <div className="flex items-center space-x-6 text-white text-xl">
          {/* Cart Icon */}
          <Link to="/cart" className={`hover:text-[#D7C9C1] ${isActive('/cart') ? 'text-[#D7C9C1]' : ''}`}>
            <FiShoppingCart />
          </Link>

          {/* User Icon */}
          <div className="hover:text-[#D7C9C1] cursor-pointer" onClick={handleUserIconClick}>
            <FiUser />
          </div>

          {/* Logout Icon */}
          {isLoggedIn && (
            <div className="hover:text-[#D7C9C1] cursor-pointer flex items-center space-x-2" onClick={handleLogout}>
              <FiLogOut />
              <span className="text-[13px] uppercase">Logout</span>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {!isDesktop && (
            <div className="lg:hidden text-white text-2xl cursor-pointer" onClick={toggleMenu}>
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
