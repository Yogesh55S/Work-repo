import React from 'react';
import LeftArrow from '../../assets/svg/leftarrow.svg'; // Import the left arrow SVG

const Security = () => {
  return (
    <>
      {/* Inline CSS for 768px frame */}
      <style>
        {`
          @media (min-width: 768px) and (max-width: 768px) {
            .security-container {
              margin: 0 auto; /* Center the container horiztext-align: center; /* Center align text */
            }
            
          }
        `}
      </style>

      <div className="max-w-lg px-6 security-container">
        {/* Header Section */}
        <div className="mb-6 text-left">
          <h1 className="text-xl font-bold flex items-center security-header text-gray-800">
            Change Password
            <img src={LeftArrow} alt="Left Arrow" className="w-[100px] h-[70px] ml-4 security-arrow" />
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Please enter a strong and secure password to ensure your account's safety.
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-6">
          {/* Old Password */}
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-bold text-gray-800 mb-2">
              Enter Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring focus:ring-brown-500"
              placeholder="********"
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-800 mb-2">
              Enter New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring focus:ring-brown-500"
              placeholder="********"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 mb-2">
              Re-enter New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring focus:ring-brown-500"
              placeholder="********"
            />
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end security-button">
            <button
              type="submit"
              className="w-full md:w-full lg:w-[160px] lg:h-[50px] bg-button-primary text-white font-bold py-3 px-4 hover:bg-[#70471F] transition duration-300"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Security;
