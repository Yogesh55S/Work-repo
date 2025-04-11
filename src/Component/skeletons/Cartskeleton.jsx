import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CartSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='flex flex-col lg:flex-row items-center gap-5'>
        {/* Cart Items List Skeleton */}
        <div className='flex-1 space-y-4 w-full'>
          {[...Array(2)].map((_, index) => (
            <div key={index} className='flex items-start border-b-2 p-4 sm:p-2'>
              {/* Product Image Skeleton */}
              <Skeleton
                width={128}
                height={128}
                className='mr-4 sm:w-32 sm:h-32 md:w-24 md:h-24'
              />

              <div className='flex-1'>
                {/* Product Name & Price */}
                <div className='flex justify-between md:items-center'>
                  <Skeleton width={200} height={20} />
                  <Skeleton width={60} height={20} className='mt-10 md:mt-0' />
                </div>

                {/* Quantity Selector */}
                <div className='mt-2 flex items-center gap-2'>
                  <Skeleton width={30} height={18} />
                  <Skeleton width={60} height={32} />
                </div>

                {/* Action Button */}
                <div className='mt-2'>
                  <Skeleton width={90} height={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className='w-[350px] h-[132px] bg-gray-100 p-4 rounded-lg sticky top-6 lg:self-start'>
          <div className='text-xl font-semibold flex justify-between'>
            <Skeleton width={150} height={24} />
            <Skeleton width={80} height={24} />
          </div>
          <div className='flex justify-center mt-6'>
            {/* Fix: Wrap skeleton button in a div with full width */}
            <div className='w-full'>
              <Skeleton height={40} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CartSkeleton;
