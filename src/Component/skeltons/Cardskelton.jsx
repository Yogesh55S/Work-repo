import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  const [skeletonsToShow, setSkeletonsToShow] = useState(4);

  const calculateSkeletonsToShow = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1440) {
      setSkeletonsToShow(4); // Show 4 cards for large screens
    } else if (screenWidth >= 1024) {
      setSkeletonsToShow(3); // 3 cards for large screens
    } else if (screenWidth >= 768) {
      setSkeletonsToShow(2); // 2 cards for medium screens
    } else {
      setSkeletonsToShow(1); // 1 card for small screens
    }
  };

  useEffect(() => {
    calculateSkeletonsToShow();
    window.addEventListener('resize', calculateSkeletonsToShow);
    return () => {
      window.removeEventListener('resize', calculateSkeletonsToShow);
    };
  }, []);

  const SingleCardSkeleton = () => (
    <div className='max-w-[300px] relative flex flex-col items-center gap-2 mx-auto'>
      <div className='animate-pulse flex flex-col'>
        {/* Image placeholder - match Card.jsx exactly */}
        <div className='relative overflow-hidden'>
          <Skeleton className='rounded-lg' height={400} width={300} />
        </div>

        {/* Title and price container - match Card.jsx */}
        <div className='text-center mt-4 mx-auto w-full'>
          {/* Title placeholder */}
          <Skeleton className='mb-2 rounded' height={20} width='75%' />
          {/* Price placeholder */}
          <Skeleton className='rounded' height={20} width='25%' />
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex flex-wrap justify-center mx-auto gap-3'>
      {Array(skeletonsToShow)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className='cursor-pointer transform transition duration-300'
          >
            <SingleCardSkeleton />
          </div>
        ))}
    </div>
  );
};

export default CardSkeleton;
