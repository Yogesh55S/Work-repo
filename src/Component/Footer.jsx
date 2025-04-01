import { FiInstagram } from 'react-icons/fi'; // Import the email icon FiMail
import { FiFacebook } from 'react-icons/fi';
import smallrose from '../assets/svg/smallrose.svg'; // Import your SVG
import locationIcon from '../assets/svg/location.svg'; // Location SVG
import phoneIcon from '../assets/svg/phonenumber.svg'; // Phone number SVG
import emailIcon from '../assets/svg/footeremail.svg'; // Email SVG

const Footer = () => {
  return (
    <footer className='bg-white border-t border-[#5C3822] font-bold'>
      <div className='container max-w-[1240px] mx-auto px-6 lg:py-10  py-5'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-20 text-center lg:text-left md:grid-cols-3 lg:gap-10 md:gap-5 md:items-center'>
          {/* About Us Section with background image */}
          <div
            className='mt-10 lg:mt-10 relative lg:pt-6 bg-cover bg-center'
            style={{
              backgroundImage: `url(${smallrose})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
          >
            <div className='relative  md:text-left lg:pb-[40px] xl:pb-[70px]'>
              <h3 className='text-lg font-bold text-gray-800'>About Us</h3>
              <p className='text-gray-600 mt-4'>
                Rooted in ancient Indian herbal wisdom, Nida’s Pure prepares
                100% natural, handmade products designed to nourish your natural
                beauty with a promise of purity and ayurveda.
              </p>
            </div>
          </div>

          {/* Shop by Category Section */}
          <div className='lg:mb-0 md:mb-5 w-[180px] md:mx-auto text-left'>
            <h3 className='text-lg font-bold text-gray-800  lg:px-0 text-left  md:text-left '>
              Shop by category
            </h3>
            <ul className='text-gray-600 mt-3 space-y-1 text-[16px] text-left md:text-left'>
              <li>
                <a href='#' className='hover:text-black'>
                  Skin Care
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-black'>
                  Body care
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-black'>
                  Hair Care
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-black'>
                  Soap Bars
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className='text-center xl:text-left lg:text-left md:text-left xl:mt-20 lg:mt-[90px] md:mt-[60px] mr-12 xl:w-[390px] lg:w-[300px] md:w-[250px] xs:w-[350px]'>
            <h3 className='text-lg font-bold text-gray-800 xl:mt-0 lg:mt-0 md:mt-16'>
              Contact Us
            </h3>
            <ul className='lg:mt-6 md:mt-8 mt-4 space-y-4'>
              <li className='flex md:items-start space-x-4'>
                <div className='w-[100px] md:w-[150px] lg:w-[100px] xl:w-[75px] h-auto flex items-center justify-center'>
                  <img
                    src={locationIcon}
                    alt='Location Icon'
                    className='w-full h-full object-contain'
                  />
                </div>
                <p className='text-gray-600'>
                  41, RAJASTHALI APARTMENT, C-1 Rd, Block C-2, Pocket 2, Sector
                  16C, Pitampura, Delhi, 110034
                </p>
              </li>
              <li className='flex md:items-start space-x-4'>
                <div className='w-[38px] h-auto flex items-center justify-center'>
                  <img
                    src={phoneIcon}
                    alt='Phone Icon'
                    className='w-full h-full object-contain'
                  />
                </div>
                <p className='text-gray-600'>+91 96432 48874</p>
              </li>
              <li className='flex md:items-start space-x-4'>
                <div className='w-[40px] h-auto flex items-center justify-center'>
                  <img
                    src={emailIcon}
                    alt='Email Icon'
                    className='w-full h-full object-contain'
                  />
                </div>
                <p className='text-gray-600'>nidaspure2@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='w-full bg-button-primary h-20 flex justify-between items-center px-6 lg:px-40'>
        {/* Left Section */}
        <p className='text-white md:text-[16px] text-[13px] text-left xl:ml-[-50px] lg:ml-[-150px] md:ml-[-15px]'>
          © 2024 YourCompany. All Rights Reserved.
        </p>

        {/* Right Section */}
        <div className='flex space-x-4 xl:mr-[-30px] lg:mr-[-140px] md:mr-[-10px]'>
          <a href='#' className='text-white hover:text-[#f8bdb9]'>
            <FiFacebook size={20} />
          </a>
          <a href='#' className='text-white hover:text-[#f8bdb9]'>
            <FiInstagram size={20} />
          </a>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @media (max-width: 480px) {
          .grid {
            text-align: left !important;
          }

          .grid h3,
          .grid p,
          .grid ul li,
          .grid a {
            text-align: left;
          }

          .grid ul li {
            margin-left: 0;
          }

          .text-center {
            text-align: left !important;
          }
        }

        @media (max-width: 768px) and (min-width: 481px) {
          .icon-email {
            width: 2.5rem; /* Ensure equal width and height for circular shape */
            height: 2.5rem;
            padding: 0; /* Remove padding */
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
