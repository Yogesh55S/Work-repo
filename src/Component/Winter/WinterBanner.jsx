import winterCollection from '../../assets/Image/winterbanner.webp';
import Snowfall from './Snowfall';

const WinterBanner = () => {
  return (
    <>
      <div className='relative h-80 flex items-center justify-center'>
        {/* Snowfall Effect */}
        <div className='absolute inset-0'>
          <Snowfall />
        </div>

        {/* Background Image */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${winterCollection})`,
          }}
        ></div>

        {/* Banner Title */}
        <h1
          className='relative text-gradient px-4 py-2 z-10'
          data-text='Winter Collection'
        >
          Winter Collection
        </h1>
      </div>
    </>
  );
};

export default WinterBanner;
