import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'; // Import the email icon FiMail
import { FiFacebook, FiTwitter, FiGithub, FiDribbble } from 'react-icons/fi';
import smallrose from '../assets/svg/smallrose.svg';  // Import your SVG

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6 lg:py-10 md:py-5 py-5 xl:px-40 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 text-center lg:text-left">
          {/* About Us Section with background image */}
          <div className="mt-10 lg:mt-10 relative lg:p-6 bg-cover bg-center" 
               style={{ backgroundImage: `url(${smallrose})` }}>
            <div className="relative z-10 text-center mb-20">
              <h3 className="text-lg font-bold text-gray-800">About Us</h3>
              <p className="text-gray-600 mt-4 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          {/* Shop by Category Section */}
          <div className="lg:mt-[58px]">
            <h3 className="text-lg font-bold text-gray-800 xl:px-16 lg:px-0 px-16 text-center">Shop by category</h3>
            <ul className='text-gray-600 mt-3 space-y-1 text-center text-[16px]'>
              <li><a href="#" className="hover:text-black">Skin Care</a></li>
              <li><a href="#" className="hover:text-black">Body care</a></li>
              <li><a href="#" className="hover:text-black">Hair Care</a></li>
              <li><a href="#" className="hover:text-black">Soap Bars</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="text-center lg:text-left lg:mb-0 mb-10 lg:mt-[58px]">
            <h3 className="text-lg font-bold text-gray-800">Contact Us</h3>
            <ul className="mt-6 space-y-3">
              <li className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-4">
                <div className="bg-button-primary text-white w-8 h-8 flex items-center justify-center rounded-full">
                  <FiMapPin size={20} />
                </div>
                <p className="text-gray-600 mt-2 lg:mt-0">
                  72 Main Drive, <br />
                  Calibry, Florida 20304
                </p>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-4">
                <div className="bg-button-primary text-white w-8 h-8 flex items-center justify-center rounded-full">
                  <FiPhone size={20} />
                </div>
                <p className="text-gray-600 mt-2 lg:mt-0">
                  Helpline 24/7: <br /> +1 (700) 111 00 222
                </p>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-4">
                <div className="bg-button-primary text-white w-8 h-8 flex items-center justify-center rounded-full">
                  <FiMail size={20} /> {/* Replaced FiClock with FiMail */}
                </div>
                <p className="text-gray-600 mt-2 lg:mt-0">
                  Email Us: <br /> contact@yourcompany.com {/* Updated text for email */}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-button-primary h-20 flex justify-between items-center px-6 lg:px-40">
        {/* Left Section */}
        <p className="text-white md:text-sm text-[10px]">© 2024 YourCompany. All Rights Reserved.</p>

        {/* Right Section */}
        <div className="flex space-x-4 lg:mr-5 xl:mr-36">
          <a href="#" className="text-white hover:text-[#f8bdb9]">
            <FiFacebook size={20} />
          </a>
          <a href="#" className="text-white hover:text-[#f8bdb9]">
            <FiTwitter size={20} />
          </a>
          <a href="#" className="text-white hover:text-[#f8bdb9]">
            <FiGithub size={20} />
          </a>
          <a href="#" className="text-white hover:text-[#f8bdb9]">
            <FiDribbble size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
