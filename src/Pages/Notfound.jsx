import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden'>
      {/* Desert Background Elements */}
      <div className='absolute inset-0 overflow-hidden opacity-30 pointer-events-none'>
        {/* Sand Dunes */}
        <svg
          className='absolute bottom-0 left-0 w-full'
          viewBox='0 0 1200 300'
          preserveAspectRatio='none'
        >
          <path
            d='M0,100 Q300,180 600,120 Q900,60 1200,140 L1200,300 L0,300 Z'
            fill='#d97706'
          />
          <path
            d='M0,180 Q300,100 600,160 Q900,220 1200,140 L1200,300 L0,300 Z'
            fill='#b45309'
          />
        </svg>

        {/* Sun */}
        <div className='absolute top-12 right-12'>
          <svg className='w-32 h-32' viewBox='0 0 100 100'>
            <circle cx='50' cy='50' r='40' fill='#f59e0b' />
          </svg>
        </div>
      </div>

      {/* Left Cacti */}
      <div className='absolute left-4 bottom-0 h-64 w-32 md:h-96 md:w-48 overflow-hidden pointer-events-none'>
        <svg
          viewBox='0 0 100 200'
          className='h-full'
          preserveAspectRatio='xMinYMax'
        >
          <path
            d='M50,10 L50,180 Q50,200 70,200 L30,200 Q50,200 50,180 Z'
            fill='#065f46'
          />
          <path
            d='M50,40 L20,40 L20,90 Q20,100 30,100 L30,100 Q40,100 40,90 L40,50 L50,50'
            fill='#065f46'
          />
          <path
            d='M50,70 L80,70 L80,120 Q80,130 70,130 L70,130 Q60,130 60,120 L60,80 L50,80'
            fill='#065f46'
          />
        </svg>
      </div>

      {/* Right Cacti */}
      <div className='absolute right-4 bottom-0 h-48 w-32 md:h-80 md:w-48 overflow-hidden pointer-events-none'>
        <svg
          viewBox='0 0 100 150'
          className='h-full'
          preserveAspectRatio='xMaxYMax'
        >
          <path
            d='M40,10 L40,130 Q40,150 60,150 L20,150 Q40,150 40,130 Z'
            fill='#065f46'
          />
          <path
            d='M40,30 L15,50 L20,80 Q22,90 30,85 L30,85 Q38,80 35,70 L30,45 L40,35'
            fill='#065f46'
          />
          <path
            d='M40,60 L65,80 L60,110 Q58,120 50,115 L50,115 Q42,110 45,100 L50,75 L40,65'
            fill='#065f46'
          />
          <circle cx='30' cy='55' r='3' fill='#fef3c7' /> {/* Cactus flower */}
          <circle cx='55' cy='95' r='3' fill='#fef3c7' /> {/* Cactus flower */}
        </svg>
      </div>

      {/* Content Container */}
      <div className='relative z-10 max-w-md mx-auto text-center'>
        {/* 404 Desert Icon */}
        <div className='relative mx-auto w-48 h-48 mb-6'>
          <svg
            viewBox='0 0 200 200'
            className='absolute top-0 left-0 w-full h-full'
          >
            <path
              fill='#d97706'
              d='M44.7,-76.4C58.9,-69.2,72,-58.4,79.4,-44.7C86.9,-31,88.8,-14.4,86.6,1.3C84.5,16.9,78.4,31.9,70.1,46.4C61.8,61,51.3,75.1,37.7,82.9C24,90.7,7.2,92.2,-8.1,88.8C-23.4,85.4,-37.1,77,-48.7,66.5C-60.3,56,-69.8,43.3,-75.3,29.3C-80.9,15.4,-82.5,0.2,-79.1,-13.4C-75.7,-27,-67.2,-39,-56.6,-47.7C-46,-56.4,-33.4,-61.9,-21.2,-70.5C-8.9,-79.2,3,-91.1,16.7,-94.1C30.5,-97.1,46.1,-91.2,44.7,-76.4Z'
              transform='translate(100 100)'
            />
          </svg>

          {/* Number 404 */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-6xl font-bold text-white drop-shadow-lg'>
              404
            </span>
          </div>
        </div>

        <h1 className='text-3xl font-bold text-amber-900 mb-4'>
          Oops! You&apos;ve wandered into the desert
        </h1>

        <p className='text-lg mb-8 text-amber-800'>
          The page you&apos;re looking for seems to have dried up or was just a
          mirage all along.
        </p>

        <Link
          to='/'
          className='inline-flex items-center px-6 py-3 text-lg font-medium rounded-full text-white bg-amber-700 hover:bg-amber-800 transition-colors duration-300 shadow-lg hover:shadow-xl'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            ></path>
          </svg>
          Return to the Oasis
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
