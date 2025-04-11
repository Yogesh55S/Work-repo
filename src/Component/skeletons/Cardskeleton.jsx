import { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  const [skeletonsToShow, setSkeletonsToShow] = useState(4);

  // Using the exact same calculation logic as Winter.jsx
  const calculateSlidesToShow = () => {
    const screenWidth = window.innerWidth;
    const cardWidth = 300;
    const spaceBetweenCards = 20;
    const totalCardWidth = cardWidth + spaceBetweenCards;

    if (screenWidth >= 1440) {
      setSkeletonsToShow(4);
    } else {
      // Matching Winter.jsx exactly
      const calculatedSlides = Math.floor(screenWidth / totalCardWidth);
      setSkeletonsToShow(calculatedSlides);
    }
  };

  useEffect(() => {
    calculateSlidesToShow();
    window.addEventListener('resize', calculateSlidesToShow);
    return () => {
      window.removeEventListener('resize', calculateSlidesToShow);
    };
  }, []);

  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='relative w-full'>
        <div className='flex' style={{ margin: '0 -10px' }}>
          {/* Display skeletonToShow cards exactly like Winter.jsx */}
          {Array(skeletonsToShow || 1)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className='cursor-pointer'
                style={{
                  padding: '0 10px',
                  width: `${100 / Math.max(skeletonsToShow, 1)}%`,
                }}
              >
                <div className='max-w-[300px] w-full mx-auto'>
                  <div className='animate-pulse flex flex-col'>
                    {/* Image placeholder */}
                    <div className='relative overflow-hidden'>
                      <Skeleton
                        className='rounded-lg'
                        height={400}
                        width='100%'
                      />
                    </div>

                    {/* Title and price container */}
                    <div className='text-center mt-4 w-full'>
                      <Skeleton
                        className='mb-2 rounded'
                        height={20}
                        width='75%'
                      />
                      <Skeleton className='rounded' height={20} width='25%' />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CardSkeleton;
