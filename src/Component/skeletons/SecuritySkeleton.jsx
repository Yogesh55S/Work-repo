import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SecuritySkeleton = () => {
  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='max-w-lg px-6 security-container'>
        <div className='section-header'>
          <h2 className='personal'>
            <Skeleton width={180} height={28} />
          </h2>
        </div>

        <form className='space-y-6'>
          {/* Email Field Skeleton */}
          <div className='form-group'>
            <label className='font-semibold'>
              <Skeleton width={80} height={18} />
            </label>
            <div className='field-wrapper'>
              <Skeleton height={40} />
            </div>
          </div>

          {/* Password Fields Skeletons */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className='form-group'>
              <label className='font-semibold'>
                <Skeleton width={120} height={18} />
              </label>
              <div className='field-wrapper'>
                <Skeleton height={40} />
              </div>
            </div>
          ))}

          {/* OTP Field Skeleton (conditionally shown) */}
          <div className='form-group'>
            <label className='font-semibold'>
              <Skeleton width={40} height={18} />
            </label>
            <div className='field-wrapper'>
              <Skeleton height={40} />
            </div>
          </div>

          {/* Button Group Skeleton */}
          <div className='button-group'>
            <Skeleton width={140} height={40} style={{ borderRadius: '4px' }} />
            <Skeleton
              width={100}
              height={40}
              style={{ marginLeft: '20px', borderRadius: '4px' }}
            />
          </div>
        </form>
      </div>
    </SkeletonTheme>
  );
};

export default SecuritySkeleton;
