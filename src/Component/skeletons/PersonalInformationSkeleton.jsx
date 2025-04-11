import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/PersonalInformation.css';

const PersonalInformationSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='personal-info-container'>
        <div className='section-header'>
          <h2 className='personal'>
            <Skeleton width={200} height={28} />
          </h2>
        </div>
        <p className='description'>
          <Skeleton count={2} />
        </p>

        <div className='personal-info-form'>
          <div className='form-group full-name'>
            <label className='font-semibold'>
              <Skeleton width={80} height={18} />
            </label>
            <div className='field-wrapper'>
              <Skeleton height={40} />
            </div>
          </div>

          <div className='section-header'>
            <h2 className='contact'>
              <Skeleton width={180} height={28} />
            </h2>
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label className='font-semibold'>
                <Skeleton width={120} height={18} />
              </label>
              <div className='field-wrapper'>
                <Skeleton height={40} />
              </div>
            </div>

            <div className='form-group'>
              <label className='font-semibold'>
                <Skeleton width={80} height={18} />
              </label>
              <div className='field-wrapper'>
                <Skeleton height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PersonalInformationSkeleton;
