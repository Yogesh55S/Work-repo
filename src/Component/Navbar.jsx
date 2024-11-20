import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { HiMenu, HiX } from 'react-icons/hi'; // Hamburger and Cross icons
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const menuRef = useRef();

  // Function to check if the current route matches the nav item
  const isActive = (path) => location.pathname === path;

  // Toggle Menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle window resize to toggle desktop/mobile view dynamically
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target) && !isDesktop) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isDesktop]);

  return (
    <nav className="bg-[#e5cfc3] h-20 flex items-center">
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#0d0d0d]">
          <Link to="/">Nidas Pure</Link>
        </div>

        {/* Navigation Links */}
        <AnimatePresence>
          {isMenuOpen && !isDesktop && (
            <motion.ul
              ref={menuRef}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-4 fixed top-20 left-0 bg-[#e5cfc3] w-full py-4 lg:hidden"
            >
              {[{ name: 'Home', path: '/' },
                { name: 'Winter Collection', path: '/winter-collection' },
                { name: 'Shop', path: '/shop' },
                { name: 'Contact Us', path: '/contact' },
              ].map((navItem) => (
                <li key={navItem.path} className="list-none px-4">
                  <Link
                    to={navItem.path}
                    className={`hover:text-[#c28565] text-[13px] font-medium uppercase ${
                      isActive(navItem.path) ? 'text-[#c28565]' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)} // Close menu on item click
                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}

          {/* For desktop */}
          {isDesktop && (
            <ul className="hidden lg:flex lg:space-x-6 lg:items-center lg:static text-[#0d0d0d] text-[13px] font-medium uppercase lg:ml-16">
              {[{ name: 'Home', path: '/' },
                { name: 'Winter Collection', path: '/winter-collection' },
                { name: 'Shop', path: '/shop' },
                { name: 'Contact Us', path: '/contact' },
              ].map((navItem) => (
                <li key={navItem.path} className="list-none px-4">
                  <Link
                    to={navItem.path}
                    className={`hover:text-[#c28565] ${
                      isActive(navItem.path) ? 'text-[#c28565]' : ''
                    }`}
                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AnimatePresence>

        {/* Icons */}
        <div className="flex items-center space-x-6 text-[#0d0d0d] text-xl">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className={`hover:text-[#c28565] ${
              isActive('/cart') ? 'text-[#c28565]' : ''
            }`}
          >
            <FiShoppingCart />
          </Link>

          {/* Profile Icon */}
          <Link
            to="/profile"
            className={`hover:text-[#c28565] ${
              isActive('/profile') ? 'text-[#c28565]' : ''
            }`}
          >
            <FiUser />
          </Link>

          {/* Hamburger Icon */}
          {!isDesktop && (
            <div
              className="lg:hidden text-[#0d0d0d] text-2xl cursor-pointer"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
