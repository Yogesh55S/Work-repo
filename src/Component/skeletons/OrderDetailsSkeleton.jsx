import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const OrderDetailsSkeleton = () => {
  // Generate dummy items for the skeleton
  const itemCount = 3;

  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='max-w-6xl mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>
          <Skeleton width={180} height={32} />
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Order Info Section Skeleton */}
          <div className='border p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>
              <Skeleton width={120} height={24} />
            </h2>
            {/* Order details items */}
            {[...Array(5)].map((_, index) => (
              <p className='mb-2' key={`order-info-${index}`}>
                <Skeleton width={index % 2 === 0 ? 250 : 200} height={20} />
              </p>
            ))}
          </div>

          {/* Customer Info Section Skeleton */}
          <div className='border p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>
              <Skeleton width={150} height={24} />
            </h2>
            {/* Customer info items */}
            {[...Array(3)].map((_, index) => (
              <p className='mb-2' key={`customer-info-${index}`}>
                <Skeleton width={index === 2 ? 300 : 220} height={20} />
              </p>
            ))}
          </div>
        </div>

        {/* Items Section Skeleton */}
        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>
            <Skeleton width={160} height={24} />
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(itemCount)].map((_, index) => (
              <div
                key={`item-${index}`}
                className='border rounded-lg shadow-md p-4 flex items-center'
              >
                {/* Product image skeleton */}
                <Skeleton width={80} height={80} className='rounded mr-4' />

                <div>
                  {/* Product name skeleton */}
                  <p className='text-lg font-semibold text-gray-800'>
                    <Skeleton width={120} />
                  </p>
                  {/* Quantity skeleton */}
                  <p className='text-sm text-gray-600'>
                    <Skeleton width={80} />
                  </p>
                  {/* Price skeleton */}
                  <p className='text-sm text-gray-600'>
                    <Skeleton width={60} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default OrderDetailsSkeleton;
