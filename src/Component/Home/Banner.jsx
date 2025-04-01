import { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa'; // Import the Font Awesome Leaf icon
import kittenImage from '../../assets/Image/banner2.png'; // Import the first image
import yogaImage from '../../assets/Image/banner2.png'; // Import the second image
import backgroundImage from '../../assets/Image/bannerbackground.png'; // Import the background image

const banners = [
  {
    id: 1,
    title: 'Transforming',
    subtitleLine1: 'Surgical Artistry',
    subtitleLine2: 'Unveiling Beauty',
    buttonText: 'Our Services',
    image: kittenImage,
  },
  {
    id: 2,
    title: 'Transforming',
    subtitleLine1: 'Surgical Artistry',
    subtitleLine2: 'Unveiling Beauty',
    buttonText: 'Learn More',
    image: yogaImage,
  },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className='relative h-[100vh] md:h-[100vh]  lg:h-[100vh]'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay to increase opacity */}
        <div className='absolute inset-0 bg-primary opacity-5'></div>
      </div>

      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 mx-auto flex items-center justify-center transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='w-full xs:mt-20 sm:mt-0 h-full  mx-auto flex flex-col md:flex-row items-center md:items-start px-6 md:px-8 lg:px-12 relative z-10'>
            {/* Left Side Text */}
            <div className='w-full md:w-[500px] xs:pt-10  flex flex-col items-start text-left space-y-3 my-auto mx-auto'>
              {/* Leaf Icon and Natural Beauty Text */}
              <div className='flex items-center space-x-2 text-white text-sm font-medium'>
                <FaLeaf className='text-xl' />
                <span>Natural Beauty</span>
              </div>

              <h1 className='text-4xl sm:text-4xl xl:text-7xl lg:text-6xl md:text-5xl  text-white tracking-wider'>
                {banner.title}
              </h1>
              <h2 className='text-3xl sm:text-3xl lg:text-5xl xl:text-5xl md:text-4xl  text-white tracking-wider'>
                {banner.subtitleLine1}
              </h2>
              <h2 className='text-3xl sm:text-3xl lg:text-5xl xl:text-5xl md:text-4xl  text-white tracking-wider'>
                {banner.subtitleLine2}
              </h2>
              <button className='px-6 py-2 bg-button-primary text-white text-lg shadow hover:bg-primary transition'>
                {banner.buttonText}
              </button>

              {/* Right Side with Dynamic Image */}
              <div className=' md:hidden w-full md:w-1/2 flex items-center justify-center md:mb-0 xs:mb-10 md-sm:mb-36 sm:mb-36'>
                <img
                  src={banner.image}
                  alt='Banner Image'
                  className='w-full  md:w-full h-full'
                />
              </div>
            </div>

            <div className=' hidden md:block w-full md:w-1/2  items-center  justify-center mt-28'>
              <img
                src={banner.image}
                alt='Banner Image'
                className='  lg:w-[600px] lg:h-[600px]'
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;
