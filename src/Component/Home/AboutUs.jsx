import React from "react";
import bannerImage from "../../assets/image/ushape.png"; // Replace with your image path

const AboutUs = () => {
  return (
    <div className="bg-white py-16 px-6">
      {/* Centered Container */}
      <div className="container mx-auto max-w-[1240px] flex flex-col md:flex-row items-center gap-8">
        {/* Left Image Section */}
        <div className="lg:left-[-60px] lg:top-[-15px] md:left-[-55px] md:top-[-10px] sm:left-[-50px] sm:top-[-40px] xs:left-[-50px] xs:top-[-40px]  relative md:w-1/2 flex justify-center">
          {/* Background Image with Opacity */}
          <div className="absolute lg:w-[271px] lg:h-[390px] md:w-[250px] md:h-[360px] sm:w-[271px] sm:h-[390px] xs:w-[220px] xs:h-[320px] rounded-t-[400px] overflow-hidden xl:-top-[-50px] xl:-left-[-300px] lg:-top-[-60px] lg:-left-[-230px] md:-left-[-150px] md:top-[60px] sm:right-[-100px] sm:top-[60px] xs:right-[-100px] xs:top-[60px]">
            <img
              src={bannerImage}
              alt="Background Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-button-primary opacity-60"></div>
          </div>

          {/* Foreground Image Without Opacity */}
          <div className="relative lg:w-[271px] lg:h-[390px] md:w-[250px] md:h-[360px] sm:w-[271px] sm:h-[390px] xs:w-[220px] xs:h-[320px] rounded-t-[400px] overflow-hidden shadow-lg z-10">
            <img
              src={bannerImage}
              alt="Foreground Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="md:w-1/2 lg:space-y-5 md:space-y-3 sm:space-y-4 xs:space-y-4 lg:mr-8 sm:mt-10 md:text-left sm:text-center xs:text-center xs:mt-5">
          <h2 className="text-[30px] font-bold text-text uppercase">About Us</h2>
          <h1 className="lg:text-5xl md:text-4xl sm:text-3xl xs:text-3xl font-bold text-black sm:mt-5">
            We are Put <span className="text-text">Beauty</span> Above Everything
          </h1>
          <p className="text-black lg:text-lg md:text-[16px] leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            pellentesque ac urna at malesuada. Nunc mattis cursus massa, non
            facilisis nisi ultricies id. Cras dapibus porta ultrices. Proin eu
            eros et nisi tempus egestas elementum quis justo.
          </p>

          {/* Image + List Section */}
          <div className="flex items-start lg:gap-4 md:gap-2 sm:mt-5">
            {/* Small Image to the Left */}
            <div className="w-[156px] h-[80px] ">
              <img
                src={bannerImage}
                alt="U-Shape Small Image"
                className="w-full h-full object-cover"
              />
            </div>

            {/* List */}
            <ul className="space-y-1 text-[14px] sm:text-[14px] xs:text-[10px] md:mt-0 sm:mt-0 xs:mt-3">
              <li className="flex sm:items-center gap-3 text-black">
                <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 sm:w-2 sm:h-2 xs:w-2 xs:h-2 md:ml-0 sm:ml-3 xs:ml-2 md:mt-0 sm:mt-0 xs:mt-1 bg-text rounded-full "></span>
                Lorem ipsum dolor sit amet.
              </li>
              <li className="flex items-center gap-3 text-black">
                <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 sm:w-2 sm:h-2 xs:w-2 xs:h-2 md:ml-0 sm:ml-3 xs:ml-2 md:mt-0 sm:mt-0 xs:mt-1 bg-text rounded-full"></span>
                Lorem ipsum dolor sit amet.
              </li>
              <li className="flex items-center gap-3 text-black">
                <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 sm:w-2 sm:h-2 xs:w-2 xs:h-2 md:ml-0 sm:ml-3 xs:ml-2 md:mt-0 sm:mt-0 xs:mt-1 bg-text rounded-full"></span>
                Lorem ipsum dolor sit amet.
              </li>
            </ul>
          </div>

          <button className="px-6 py-3  bg-button-primary text-white font-semibold hover:bg-hover hover:text-black transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
