import bannerImage from '../../assets/Image/ushape.png'; // Replace with your image path
import leftArrow from '../../assets/svg/leftarrow.svg'; // Replace with your SVG path
import about from '../../assets/svg/about.svg'; // Replace

const AboutUs = () => {
  // Function to handle scroll to OurProducts section
  const scrollToProducts = () => {
    const productsSection = document.getElementById('our-products-section');
    if (productsSection) {
      // Calculate the scroll position (element's position from the top minus navbar height)
      const offsetPosition =
        productsSection.getBoundingClientRect().top + window.pageYOffset - 100;
      // Scroll to the adjusted position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='bg-white py-16 px-6'>
      {/* Centered Container */}
      <div className='container mx-auto max-w-[1240px] flex flex-col md:flex-row items-center gap-8'>
        {/* Left Image Section */}
        <div className='relative xl:left-[-40px] xl:top-[-20px] lg:left-[-60px] lg:top-[-40px] md:left-[-50px] md:top-[-20px] md-sm:left-[-50px] md-sm:top-[-20px] sm:left-[-35px] sm:top-[-20px] xs:left-[-40px] xs:top-[-20px] md:w-1/2 flex justify-center'>
          {/* Background Image with Opacity */}
          <div className='absolute lg:w-[271px] lg:h-[390px] md:w-[250px] md:h-[360px] sm:w-[271px] sm:h-[390px] xs:w-[220px] xs:h-[320px] rounded-t-[400px] overflow-hidden xl:-top-[-50px] xl:-left-[-260px] lg:-top-[-60px] lg:-left-[-230px] md:-left-[-150px] md:top-[60px] md-sm:right-[-100px] md-sm:top-[60px] xs:right-[-80px] xs:top-[60px] sm:right-[-70px] sm:top-[60px]'>
            <img
              src={bannerImage}
              alt='Background Image'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-button-primary opacity-60'></div>
          </div>

          {/* Foreground Image Without Opacity */}
          <div className='relative lg:w-[271px] lg:h-[390px] md:w-[250px] md:h-[360px] sm:w-[271px] sm:h-[390px] xs:w-[220px] xs:h-[320px] rounded-t-[400px] overflow-hidden shadow-lg z-10'>
            <img
              src={bannerImage}
              alt='Foreground Image'
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        {/* Right Content Section */}
        <div className='md:w-1/2 lg:space-y-5 md:space-y-3 sm:space-y-4 xs:space-y-4 lg:mr-8 sm:mt-10 md:text-left sm:text-center xs:text-center xs:mt-5 tracking-wider xl:mr-24'>
          {/* Heading with SVG */}
          <div className='flex items-center xs:justify-center sm:justify-start'>
            <h2 className='text-[16px] text-text'>About Us</h2>
            <img
              src={leftArrow}
              alt='Left Arrow'
              className='ml-2 w-[78px] h-auto xs:ml-2'
            />
          </div>

          {/* Subheading */}
          <h1 className='lg:text-4xl md:text-3xl sm:text-2xl xs:text-2xl text-black sm:mt-5 text-left'>
            Beauty Rooted in Nature
          </h1>

          {/* Description */}
          <p className='text-black lg:text-lg md:text-[16px] leading-relaxed text-left'>
            Discover the magic of 100% natural skincare, lovingly handcrafted to
            celebrate your natural beauty. Blending the timeless wisdom of
            ancient Indian herbs with the goodness of pure essential oils, our
            products are more than skincare, they are a promise of purity and
            Ayurveda!
          </p>

          {/* Image + List Section */}
          <div className='flex items-start lg:gap-4 md:gap-2 sm:mt-5'>
            {/* Small Image to the Left */}
            <div className='xs:w-[200px] xs:h-[90px] sm:w-[250px] sm:h-[140px] md-sm:w-[250px] md-sm:h-[120px] md:w-[250px] md:h-[130px] xl:w-[156px] xl:h-[90px] lg:w-[200px] lg:h-[100px]'>
              <img
                src={about}
                alt='U-Shape Small Image'
                className='w-full h-full object-cover'
              />
            </div>

            {/* List */}
            <ul className='space-y-1 text-[13px] sm:text-[13px] xs:text-[10px] xl:text-[14px]  xs:text-left'>
              <li className='flex sm:items-center gap-3 text-black xs:justify-start lg:ml-0 md:ml-2 sm:ml-4 xs:ml-3'>
                <span className='dot'></span>
                Ancient Indian herbs blended in essential oils
              </li>
              <li className='flex items-center gap-3 text-black xs:justify-start lg:ml-0 md:ml-2 sm:ml-4 xs:ml-3'>
                <span className='dot'></span>
                Promise of purity with the principles of Ayurveda
              </li>
              <li className='flex items-center gap-3 text-black xs:justify-start lg:ml-0 md:ml-2 sm:ml-4 xs:ml-3'>
                <span className='dot'></span>
                Beauty derived from absolute purity
              </li>
            </ul>
          </div>

          {/* Button - Added onClick handler for smooth scrolling */}
          <button
            className='brown-deep-button mt-4'
            onClick={scrollToProducts}
            aria-label='Shop now - go to products section'
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* CSS Styles */}
      <style>
        {`
          .dot {
            width: 0.75rem;
            height: 0.75rem;
            background-color: var(--text-color, gray);
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
          }

          /* For screens up to 480px */
          @media (max-width: 480px) {
            .dot {
              width: 0.5rem;
              height: 0.5rem;
            }
          }

          /* For screens up to 768px */
          @media (max-width: 768px) and (min-width: 481px) {
            .dot {
              width: 0.6rem;
              height: 0.6rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AboutUs;
