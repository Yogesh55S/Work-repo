import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductFormSkeleton = () => {
  // Create an array to represent form fields
  const fieldRows = Array(6).fill(0); // Adjust number based on typical form field count

  return (
    <div className='max-w-5xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg'>
      {/* Form header skeleton */}
      <div className='text-center mb-6'>
        <Skeleton height={40} width={250} className='mx-auto' />
      </div>

      {/* Form fields skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {fieldRows.map((_, index) => (
          <div key={index} className='col-span-1'>
            <Skeleton height={20} width={120} className='mb-2' /> {/* Label */}
            <Skeleton height={40} /> {/* Input */}
          </div>
        ))}

        {/* Image upload section - spans full width */}
        <div className='col-span-2'>
          <Skeleton height={20} width={150} className='mb-2' /> {/* Label */}
          <Skeleton height={180} className='mb-2' /> {/* Image preview area */}
          <Skeleton height={40} /> {/* File input */}
        </div>

        {/* Buttons section */}
        <div className='col-span-2 flex justify-between'>
          <Skeleton height={40} width={100} /> {/* Cancel button */}
          <Skeleton height={40} width={140} /> {/* Submit button */}
        </div>
      </div>
    </div>
  );
};

export default ProductFormSkeleton;
