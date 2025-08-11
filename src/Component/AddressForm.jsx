import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './providers/AuthContext';

const AddressForm = ({
  initialData,
  onSave,
  onCancel,
  title = 'Add New Address',
  showModalWrapper = true,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    deliveryName: initialData?.deliveryName || '',
    deliveryNumber: initialData?.deliveryNumber || '',
    streetAddress: initialData?.streetAddress || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip: initialData?.zip || '',
    tag: initialData?.tag || 'home',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data if initialData changes (for editing scenarios)
  useEffect(() => {
    if (initialData) {
      setFormData({
        deliveryName: initialData.deliveryName || '',
        deliveryNumber: initialData.deliveryNumber || '',
        streetAddress: initialData.streetAddress || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zip: initialData.zip || '',
        tag: initialData.tag || 'home',
      });
    } else {
      // For new addresses, pre-fill with user data if available
      setFormData(prev => ({
        ...prev,
        deliveryName: user?.fullName || '',
        deliveryNumber: user?.phone || '',
      }));
    }
  }, [initialData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Check for required fields
    if (
      !formData.deliveryName ||
      !formData.deliveryNumber ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      toast.error('Please fill in all required fields');
      return false;
    }

    // Basic phone number validation
    if (!/^\d{10}$/.test(formData.deliveryNumber.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }

    // Basic ZIP code validation
    if (!/^\d{6}$/.test(formData.zip.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Pass the ID from initialData if it exists (for edit mode)
      await onSave({ 
        ...formData, 
        _id: initialData?._id,
        // Flag to indicate if we should update user profile with this phone number
        shouldUpdateUserPhone: !user?.phone || user.phone !== formData.deliveryNumber
      });

      // Show success toast - onSave will handle closing the modal
      toast.success(
        initialData?._id
          ? 'Address updated successfully!'
          : 'Address added successfully!'
      );
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className='bg-white p-6 rounded-lg'>
      <h3 className='text-xl font-semibold text-[#6b4226] mb-6 text-center'>
        {initialData?._id ? 'Edit Address' : title}
      </h3>

      <div className='space-y-4'>
        {/* Full Name */}
        <div className='relative'>
          <input
            type='text'
            name='deliveryName'
            id='deliveryName'
            value={formData.deliveryName}
            onChange={handleChange}
            className='peer w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent'
            placeholder=' '
            required
            disabled={isSubmitting}
          />
          <label
            htmlFor='deliveryName'
            className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                     peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                     peer-focus:-top-3.5 peer-focus:text-[#6b4226] peer-focus:text-sm'
          >
            Full Name *
          </label>
        </div>

        {/* Mobile Number */}
        <div className='relative'>
          <input
            type='text'
            name='deliveryNumber'
            id='deliveryNumber'
            value={formData.deliveryNumber}
            onChange={handleChange}
            className='peer w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent'
            placeholder=' '
            required
            disabled={isSubmitting}
          />
          <label
            htmlFor='deliveryNumber'
            className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                     peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                     peer-focus:-top-3.5 peer-focus:text-[#6b4226] peer-focus:text-sm'
          >
            Mobile Number *
          </label>
        </div>

        {/* Street Address */}
        <div className='relative'>
          <input
            type='text'
            name='streetAddress'
            id='streetAddress'
            value={formData.streetAddress}
            onChange={handleChange}
            className='peer w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent'
            placeholder=' '
            required
            disabled={isSubmitting}
          />
          <label
            htmlFor='streetAddress'
            className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                     peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                     peer-focus:-top-3.5 peer-focus:text-[#6b4226] peer-focus:text-sm'
          >
            Street Address *
          </label>
        </div>

        {/* City and State Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* City */}
          <div className='relative'>
            <input
              type='text'
              name='city'
              id='city'
              value={formData.city}
              onChange={handleChange}
              className='peer w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent'
              placeholder=' '
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor='city'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                       peer-focus:-top-3.5 peer-focus:text-[#6b4226] peer-focus:text-sm'
            >
              City *
            </label>
          </div>

          {/* State */}
          <div className='relative'>
            <input
              type='text'
              name='state'
              id='state'
              value={formData.state}
              onChange={handleChange}
              className='peer w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent'
              placeholder=' '
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor='state'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                       peer-focus:-top-3.5 peer-focus:text-[#6b4226] peer-focus:text-sm'
            >
              State *
            </label>
          </div>
        </div>

        {/* ZIP and Tag Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* ZIP */}
          <div className='relative'>
            <input
              type='text'
              name='zip'
              id='zip'
              value={formData.zip}
              onChange={handleChange}
              className='peer w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent'
              placeholder=' '
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor='zip'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                       peer-focus:-top-3.5 peer-focus:text-[#6b4226] peer-focus:text-sm'
            >
              ZIP Code *
            </label>
          </div>

          {/* Tag */}
          <div className='relative'>
            <select
              name='tag'
              id='tag'
              value={formData.tag}
              onChange={handleChange}
              className='w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#6b4226] transition-colors bg-transparent appearance-none'
              required
              disabled={isSubmitting}
            >
              <option value='home'>Home</option>
              <option value='work'>Work</option>
              <option value='other'>Other</option>
            </select>
            <label
              htmlFor='tag'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm'
            >
              Address Type *
            </label>
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 grid grid-cols-2 gap-4'>
        <button
          onClick={onCancel}
          className='py-2 px-4 text-[#6b4226] font-medium border border-[#6b4226] rounded-md hover:bg-gray-50 transition-colors focus:outline-none'
          disabled={isSubmitting}
        >
          CANCEL
        </button>
        <button
          onClick={handleSubmit}
          className='py-2 px-4 bg-[#6b4226] text-white font-medium rounded-md hover:bg-[#55341a] transition-colors focus:outline-none flex justify-center items-center'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
              SAVING...
            </>
          ) : (
            'SAVE'
          )}
        </button>
      </div>
    </div>
  );

  return showModalWrapper ? (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
      {isSubmitting && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-[60]'>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className='text-white text-4xl mb-3'
          />
          <p className='text-white font-medium text-lg'>Saving Address...</p>
        </div>
      )}
      <div className='w-full max-w-md animate-fade-in-down'>{formContent}</div>
    </div>
  ) : (
    formContent
  );
};

AddressForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    deliveryName: PropTypes.string,
    deliveryNumber: PropTypes.string,
    streetAddress: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    tag: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  showModalWrapper: PropTypes.bool,
};

export default AddressForm;