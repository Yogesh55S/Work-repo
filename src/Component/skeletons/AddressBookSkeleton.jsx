import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/AddressBook.css';

const AddressCardSkeleton = () => (
  <div className='address-card'>
    <div className='address-details'>
      <p className='address-title'>
        <Skeleton width={150} />
      </p>
      <p>
        <Skeleton width={250} />
      </p>
      <p>
        <Skeleton width={150} />
      </p>
    </div>
    <div className='address-actions'>
      <Skeleton width={30} height={30} circle={true} className='mr-2' />
      <Skeleton width={30} height={30} circle={true} />
    </div>
  </div>
);

const AddressBookSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#efe6dc' highlightColor='#f5eee6'>
      <div className='address-book-container'>
        <h2 className='title'>
          <Skeleton width={180} height={30} />
        </h2>

        <div className='button-para'>
          <p>
            <Skeleton count={2} />
          </p>
          <div className='mt-5'>
            <Skeleton width={160} height={40} />
          </div>
        </div>

        <div className='address-section'>
          <div className='address-card-box default-address'>
            <h3 className='address-section-title'>
              <Skeleton width={150} height={24} />
            </h3>
            <AddressCardSkeleton />
          </div>

          <div>
            <h3 className='address-section-title'>
              <Skeleton width={150} height={24} />
            </h3>
            <AddressCardSkeleton />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default AddressBookSkeleton;
