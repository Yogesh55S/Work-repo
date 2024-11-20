import React from 'react';
import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi'; // Minimal icons for the contact section
import { FiFacebook, FiTwitter, FiGithub, FiDribbble } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-pink-50">
      <div className="container mx-auto px-6 lg:py-10 md:py-5 py-5 lg:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 text-center lg:text-left">
          {/* About Us Section */}
          <div className="mt-10 lg:mt-10">
            <h3 className="text-lg font-bold text-gray-800">About Us</h3>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <button className="mt-6 px-6 py-3 bg-[#f8bdb9] text-white rounded-full hover:bg-[#f89c95] flex items-center justify-center mx-auto lg:mx-0">
              <span className="mr-2">→</span> Make Appointment
            </button>
          </div>

          {/* Newsletter Signup Section */}
          <div className=" lg:mt-10">
            <h3 className="text-lg font-bold text-gray-800">Newsletter Signup</h3>
            <p className="text-gray-600 mt-4">
              Enter your email address to get the latest updates and offers from us.
            </p>
            <form className="mt-6 flex items-center justify-center lg:justify-start">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full max-w-xs px-4 py-3 border rounded-l-full focus:outline-none focus:ring focus:border-[#f8bdb9]"
              />
              <button
                type="submit"
                className="bg-[#f8bdb9] text-white px-6 py-3 rounded-r-full hover:bg-[#f89c95]"
              >
                →
              </button>
            </form>
          </div>

          {/* Contact Us Section */}
          <div className="text-center lg:text-left lg:mb-0 mb-10 lg:mt-10">
            <h3 className="text-lg font-bold text-gray-800">Contact Us</h3>
            <ul className="mt-6 space-y-6">
              <li className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-4">
                <div className="bg-[#f8bdb9] text-white w-12 h-12 flex items-center justify-center rounded-full">
                  <FiMapPin size={20} />
                </div>
                <p className="text-gray-600 mt-2 lg:mt-0">
                  72 Main Drive, <br />
                  Calibry, Florida 20304
                </p>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-4">
                <div className="bg-[#f8bdb9] text-white w-12 h-12 flex items-center justify-center rounded-full">
                  <FiPhone size={20} />
                </div>
                <p className="text-gray-600 mt-2 lg:mt-0">
                  Helpline 24/7: <br /> +1 (700) 111 00 222
                </p>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-4">
                <div className="bg-[#f8bdb9] text-white w-12 h-12 flex items-center justify-center rounded-full">
                  <FiClock size={20} />
                </div>
                <p className="text-gray-600 mt-2 lg:mt-0">
                  Mon to Friday: <br /> 9:00 am to 7:00 pm
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-[#fff9f9] h-20 flex justify-between items-center px-6 lg:px-40">
        {/* Left Section */}
        <p className="text-gray-600 md:text-sm text-[10px]">© 2024 YourCompany. All Rights Reserved.</p>

        {/* Right Section */}
        <div className="flex space-x-4 lg:mr-5 xl:mr-36">
          <a href="#" className="text-gray-600 hover:text-[#f8bdb9]">
            <FiFacebook size={20} />
          </a>
          <a href="#" className="text-gray-600 hover:text-[#f8bdb9]">
            <FiTwitter size={20} />
          </a>
          <a href="#" className="text-gray-600 hover:text-[#f8bdb9]">
            <FiGithub size={20} />
          </a>
          <a href="#" className="text-gray-600 hover:text-[#f8bdb9]">
            <FiDribbble size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
