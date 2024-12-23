import React from 'react';
import { FiMapPin, FiPhone, FiMail, FiInstagram } from 'react-icons/fi'; // Import the email icon FiMail
import { FiFacebook, FiTwitter, FiGithub, FiDribbble } from 'react-icons/fi';
import smallrose from '../assets/svg/smallrose.svg';  // Import your SVG

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6 lg:py-10 md:py-5 py-5 xl:px-40 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 text-center lg:text-left md:grid-cols-3 md:gap-10 md:items-center">
          {/* About Us Section with background image */}
          <div 
            className="mt-10 lg:mt-10 relative lg:pt-6 bg-cover bg-center"
            style={{
              backgroundImage: `url(${smallrose})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
          >
            <div className="relative  text-center xl:mb-24 lg:mb-[45px] md:mb-[43px]">
              <h3 className="text-lg font-bold text-gray-800">About Us</h3>
              <p className="text-gray-600 mt-4 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          {/* Shop by Category Section */}
          <div className="">
            <h3 className="text-lg font-bold text-gray-800 xl:px-16 lg:px-0 text-center">Shop by category</h3>
            <ul className='text-gray-600 mt-3 space-y-1 text-[16px] text-center'>
              <li><a href="#" className="hover:text-black">Skin Care</a></li>
              <li><a href="#" className="hover:text-black">Body care</a></li>
              <li><a href="#" className="hover:text-black">Hair Care</a></li>
              <li><a href="#" className="hover:text-black">Soap Bars</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="text-center xl:text-left lg:text-left md:text-left xl:mt-20 lg:mt-[75px] ">
            <h3 className="text-lg font-bold text-gray-800 xl:mt-0 lg:mt-0 md:mt-16">Contact Us</h3>
            <ul className="list lg:mt-6 md:mt-8 mt-4 space-y-4">
              <li className="md:flex flex-none  md:items-start space-x-4">
                <div className="bg-button-primary text-white w-8 h-8 flex items-center justify-center rounded-full">
                  <FiMapPin size={20} />
                </div>
                <p className="text-gray-600">
                  72 Main Drive, <br />
                  Calibry, Florida 20304
                </p>
              </li>
              <li className="md:flex flex-none md:items-start space-x-4">
                <div className="bg-button-primary text-white w-8 h-8 flex items-center justify-center rounded-full">
                  <FiPhone size={20} />
                </div>
                <p className="text-gray-600">
                  Helpline 24/7: <br /> +1 (700) 111 00 222
                </p>
              </li>
              <li className="md:flex flex-none md:items-start space-x-4">
                <div className="bg-button-primary text-white w-8 h-8 flex items-center justify-center rounded-full">
                  <FiMail size={20} />
                </div>
                <p className="text-gray-600">
                  Email Us: <br /> contact@yourcompany.com
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
            <FiInstagram size={20} />
          </a>
          {/* <a href="#" className="text-white hover:text-[#f8bdb9]">
            <FiGithub size={20} />
          </a>
          <a href="#" className="text-white hover:text-[#f8bdb9]">
            <FiDribbble size={20} />
          </a> */}
        </div>
      </div>

      {/* Custom Styles for 768px */}
      <style jsx>{`
        @media (max-width: 768px) {
          .md\:grid-cols-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            align-items: flex-start;
          }
          .lg\:mt-[58px] {
            margin-top: 0;
          }
          ul.mt-6 {
            margin-top: 0;
          }
        }

         @media (max-width: 480px) {
          .list {
          align-items: center;}
        }

        
      `}</style>
    </footer>
  );
};

export default Footer;
