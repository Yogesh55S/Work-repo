import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/Order.css';
import swipeArrow from '../../assets/svg/swipearrow.svg';

const UserOrdersSkeleton = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // Update the screen size state on window resize, just like in the main component
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate skeleton for 3 orders
  const orderCount = 3;

  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>
          <Skeleton width={150} />
        </h1>
        <div className='user-orders-scroll-container'>
          {Array(orderCount)
            .fill()
            .map((_, index) => (
              <React.Fragment key={index}>
                {isMobile ? (
                  /* Mobile layout skeleton */
                  <div className='order-row-mobile'>
                    {/* Product image skeleton */}
                    <Skeleton width={60} height={60} className='order-img' />

                    <div className='order-text'>
                      {/* Product name skeleton */}
                      <p className='order-name'>
                        <Skeleton width={120} />
                      </p>
                      {/* Quantity skeleton */}
                      <p className='order-quantity'>
                        <Skeleton width={80} />
                      </p>
                      {/* Expected delivery skeleton */}
                      <p className='expected-delivery'>
                        <Skeleton width={150} />
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className='order-arrow'>
                      <img src={swipeArrow} alt='Swipe Arrow' />
                    </div>
                  </div>
                ) : (
                  /* Desktop layout skeleton */
                  <div className='border border-[#5C3822] rounded-lg mb-6 overflow-hidden bg-white'>
                    {/* Order header with date, ID, and total */}
                    <div className='bg-[#5C3822] text-white p-4 flex justify-between items-center'>
                      <div>
                        <p className='order-label'>Order Placed:</p>
                        <p className='order-value flex'>
                          <Skeleton width={100} />
                        </p>
                      </div>
                      <div>
                        <p className='order-label'>Order ID:</p>
                        <p className='order-value'>
                          <Skeleton width={80} />
                        </p>
                      </div>
                      <div>
                        <p className='order-label'>Total:</p>
                        <p className='order-value'>
                          <Skeleton width={60} />
                        </p>
                      </div>
                    </div>

                    {/* Order details with expected delivery and product info */}
                    <div className='p-4 bg-gray-50'>
                      <p className='text-gray-700 font-medium mb-2'>
                        <span className='font-semibold text-gray-800'>
                          Expected Delivery:
                        </span>{' '}
                        <Skeleton width={120} />
                      </p>

                      <div className='flex items-center mb-4'>
                        {/* Product image skeleton */}
                        <Skeleton
                          width={80}
                          height={80}
                          className='rounded mr-4'
                        />

                        {/* Product details skeleton */}
                        <div className='flex-grow'>
                          <p className='text-lg font-semibold text-gray-800'>
                            <Skeleton width={200} />
                          </p>
                          <p className='text-sm text-gray-600'>
                            <Skeleton width={100} />
                          </p>
                        </div>

                        {/* View order button skeleton */}
                        <div className='flex flex-col gap-2'>
                          <Skeleton
                            width={100}
                            height={36}
                            className='rounded-md'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {index < orderCount - 1 && <hr className='order-divider' />}
              </React.Fragment>
            ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default UserOrdersSkeleton;
