import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMessageSquare, FiChevronDown } from "react-icons/fi";

const ContactForm = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto bg-white p-8 shadow-md">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Get In Touch
        </h2>

        <form className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]"
              />
              <FiUser className="absolute right-4 text-[#B09383] text-xl" />
            </div>

            {/* Email Field */}
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]"
              />
              <FiMail className="absolute right-4 text-[#B09383] text-xl" />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Field */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]"
              />
              <FiPhone className="absolute right-4 text-[#B09383] text-xl" />
            </div>

            {/* Select Field */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4  flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B09383]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-gray-400">Select</span>
                <FiChevronDown
                  className={`text-[#B09383] text-xl transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              {dropdownOpen && (
                <div className="absolute left-0 right-0 bg-white shadow-md rounded-md mt-2 z-10">
                  <div
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Feedback
                  </div>
                  <div
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Inquiry
                  </div>
                  <div
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Support
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="relative flex items-center">
            <textarea
              placeholder="Message"
              rows="5"
              className="w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]"
            ></textarea>
            <FiMessageSquare className="absolute top-4 right-4 text-[#B09383] text-xl" />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-[#c28565] text-white font-medium py-3 px-12 shadow hover:bg-[#5C3822] transition duration-300"
            >
              SEND MESSAGE →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
