import React from "react";
import bannerImage from "../../assets/image/ushape.png"; // Replace with your image path

const AboutUs = () => {
  return (
    <div className="bg-white py-16 px-6">
      {/* Centered Container */}
      <div className="container mx-auto max-w-[1240px] flex flex-col md:flex-row items-center gap-8">
        {/* Left Image Section */}
        <div className="relative md:w-1/2 flex justify-center">
          {/* Background Image with Opacity */}
          <div className="absolute w-[271px] h-[390px] rounded-t-[400px] overflow-hidden xl:-top-[-40px] xl:-left-[-280px] lg:-top-[-40px] lg:-left-[-210px] md:-left-[-150px] sm:left-[-50px]">
            <img
              src={bannerImage}
              alt="Background Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-button-primary opacity-60"></div>
          </div>

          {/* Foreground Image Without Opacity */}
          <div className="relative xl:h-[390px] lg:w-[300px] lg:h-[390px] rounded-t-[400px] overflow-hidden shadow-lg z-10">
            <img
              src={bannerImage}
              alt="Foreground Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="md:w-1/2 space-y-5">
          <h2 className="text-lg font-bold text-text uppercase">About Us</h2>
          <h1 className="text-5xl font-bold text-black">
            We are Put <span className="text-text">Beauty</span> Above Everything
          </h1>
          <p className="text-black text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            pellentesque ac urna at malesuada. Nunc mattis cursus massa, non
            facilisis nisi ultricies id. Cras dapibus porta ultrices. Proin eu
            eros et nisi tempus egestas elementum quis justo.
          </p>

          {/* Image + List Section */}
          <div className="flex items-start gap-4">
            {/* Small Image to the Left */}
            <div className="w-[156px] h-[80px]">
              <img
                src={bannerImage}
                alt="U-Shape Small Image"
                className="w-full h-full object-cover"
              />
            </div>

            {/* List */}
            <ul className="space-y-1">
              <li className="flex items-center gap-3 text-black">
                <span className="w-4 h-4 bg-text rounded-full"></span>
                Lorem ipsum dolor sit amet.
              </li>
              <li className="flex items-center gap-3 text-black">
                <span className="w-4 h-4 bg-text rounded-full"></span>
                Lorem ipsum dolor sit amet.
              </li>
              <li className="flex items-center gap-3 text-black">
                <span className="w-4 h-4 bg-text rounded-full"></span>
                Lorem ipsum dolor sit amet.
              </li>
            </ul>
          </div>

          <button className="px-6 py-3 bg-button-primary text-white font-semibold hover:bg-hover hover:text-black transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
