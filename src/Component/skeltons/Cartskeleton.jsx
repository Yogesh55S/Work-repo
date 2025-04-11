import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CartSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='flex flex-col md:flex-row gap-5'>
        {/* Cart Items List Skeleton */}
        <div className='flex-1 space-y-4'>
          {/* Generate 3 skeleton cart items */}
          {[...Array(2)].map((_, index) => (
            <div key={index} className='flex items-start border-b-2 p-4'>
              {/* Product Image */}
              <Skeleton width={96} height={96} className='mr-4' />

              <div className='flex-1'>
                {/* Product Name and Price Row */}
                <div className='flex justify-between items-center'>
                  <Skeleton width={200} height={24} /> {/* Product name */}
                  <Skeleton width={60} height={20} /> {/* Price */}
                </div>

                {/* Quantity Selector */}
                <div className='mt-2 flex items-center gap-2'>
                  <Skeleton width={30} height={18} /> {/* Qty label */}
                  <Skeleton width={60} height={32} /> {/* Dropdown */}
                </div>

                {/* Action Button */}
                <div className='mt-2'>
                  <Skeleton width={90} height={20} /> {/* Remove Item button */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className='w-full h-[132px] md:w-1/3 bg-gray-100 p-4 rounded-lg'>
          <div className='flex justify-between'>
            <Skeleton width={150} height={24} /> {/* Subtotal text */}
            <Skeleton width={80} height={24} /> {/* Price */}
          </div>
          <div className='flex justify-center mt-6'>
            <Skeleton height={40} width='100%' /> {/* Proceed to Buy button */}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CartSkeleton;
