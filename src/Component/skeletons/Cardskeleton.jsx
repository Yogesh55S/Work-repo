import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  // Custom theme colors to match your design
  const skeletonBaseColor = '#efe6dc';
  const skeletonHighlightColor = '#f5eee6';

  // State to track number of skeletons to show based on screen size
  const [skeletonsToShow, setSkeletonsToShow] = useState(4);
  const [columns, setColumns] = useState(4);

  // Calculate how many skeletons and columns to show based on screen width
  const calculateSkeletonsToShow = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1440) {
      // xl breakpoint
      setSkeletonsToShow(4);
      setColumns(4);
    } else if (screenWidth >= 1024) {
      // lg breakpoint
      setSkeletonsToShow(3);
      setColumns(3);
    } else if (screenWidth >= 768) {
      // md breakpoint
      setSkeletonsToShow(2);
      setColumns(2);
    } else {
      setSkeletonsToShow(1);
      setColumns(1);
    }
  };

  // Add window resize listener to update skeleton count
  useEffect(() => {
    calculateSkeletonsToShow();
    window.addEventListener('resize', calculateSkeletonsToShow);
    return () => {
      window.removeEventListener('resize', calculateSkeletonsToShow);
    };
  }, []);

  // Generate grid style based on columns
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem',
    justifyItems: 'center',
  };

  return (
    <div className='w-full max-w-[1240px] mx-auto'>
      <div style={gridStyle}>
        {/* Generate the appropriate number of skeleton cards based on screen size */}
        {Array(skeletonsToShow)
          .fill()
          .map((_, idx) => (
            <div key={idx} className='w-full max-w-[280px]'>
              <div className='p-3 shadow-sm rounded-lg'>
                {/* Image skeleton */}
                <Skeleton
                  height='400px'
                  width='100%'
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                  borderRadius={8}
                  className='mb-3'
                />

                {/* Product name skeleton */}
                <Skeleton
                  height={24}
                  width='80%'
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                  className='mb-2'
                />

                {/* Price skeleton */}
                <Skeleton
                  height={20}
                  width='40%'
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                  className='mb-2'
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CardSkeleton;
