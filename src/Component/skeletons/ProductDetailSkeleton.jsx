import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductDetailSkeleton = () => {
  // Custom theme colors to match your design
  const skeletonBaseColor = '#efe6dc';
  const skeletonHighlightColor = '#f5eee6';

  return (
    <div className='max-w-full mx-auto p-4 pt-28'>
      <div className='container mx-auto lg:w-[1240px]'>
        <div className='flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-12'>
          {/* Product Image Skeleton */}
          <div className='w-full md:w-[40%]'>
            <Skeleton
              height='650px'
              width='100%'
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
              borderRadius={8}
            />
            <div className='flex mt-4 space-x-4'>
              {Array(3)
                .fill()
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    height={64}
                    width={64}
                    baseColor={skeletonBaseColor}
                    highlightColor={skeletonHighlightColor}
                    borderRadius={4}
                  />
                ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className='w-full md:w-[60%]'>
            <Skeleton
              height={28}
              width='70%'
              className='mb-4'
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <Skeleton
              count={5}
              height={18}
              className='mb-2'
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <Skeleton
              height={24}
              width='50px'
              className='my-4'
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />

            {/* Product Attributes Skeleton */}
            <div>
              <Skeleton
                height={24}
                width='40%'
                className='mb-4'
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
              <ul className='ml-5 space-y-3'>
                {Array(6)
                  .fill()
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      height={18}
                      width='85%'
                      baseColor={skeletonBaseColor}
                      highlightColor={skeletonHighlightColor}
                    />
                  ))}
              </ul>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className='mt-6'>
              <Skeleton
                height={42}
                width='160px'
                borderRadius={6}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
