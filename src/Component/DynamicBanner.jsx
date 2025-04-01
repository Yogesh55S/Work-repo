import roseBackground from '../assets/Image/bannerbackground.png'; // Adjust the path to your image

const DynamicBanner = ({ pageName }) => {
  return (
    <div className='relative h-80 flex items-center justify-center'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${roseBackground})`,
        }}
      ></div>

      {/* Black Overlay */}
      <div className='absolute inset-0'></div>

      {/* Banner Title */}
      <h1 className='relative text-4xl  text-white px-4 py-2'>{pageName}</h1>
    </div>
  );
};

export default DynamicBanner;
