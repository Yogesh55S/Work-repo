import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import '../css/PersonalInformation.css';
import leftArrow from '../../assets/svg/leftarrow.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import PersonalInformationSkeleton from '../skeletons/PersonalInformationSkeleton';

const PersonalInformation = () => {
  const { token, user, updateUser } = useAuth();
  const [formData, setFormData] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user profile');

      const data = await response.json();
      const userData = data.user || {};
      
      // If user doesn't have a phone number, try to get it from their first address
      let phoneNumber = userData.phone;
      if (!phoneNumber) {
        try {
          const addressResponse = await fetch(`${API_URL}/addresses/${userData._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const addressData = await addressResponse.json();
          if (addressData.addresses && addressData.addresses.length > 0) {
            phoneNumber = addressData.addresses[0].deliveryNumber;
            
            // Update user profile with the phone number from address
            if (phoneNumber) {
              await updateUserProfileWithPhone(phoneNumber);
            }
          }
        } catch (addressError) {
          console.error('Error fetching addresses for phone:', addressError);
        }
      }

      setFormData({
        fullName: userData.fullName || '',
        phone: phoneNumber || '',
        email: userData.email || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfileWithPhone = async (phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        if (updateUser) {
          updateUser(updatedData.user);
        }
      }
    } catch (error) {
      console.error('Error updating user profile with phone:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      console.error('No token found in AuthContext.');
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [token, navigate]);

  const enableEditing = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Allow empty phone number
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10;
  };

  const validateEmail = (email) => {
    if (!email) return true; // Allow empty email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveChanges = async () => {
    try {
      // Validate phone number
      if (editableFields.phone && !validatePhoneNumber(formData.phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      // Validate email
      if (editableFields.email && !validateEmail(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update user profile');

      const updatedData = await response.json();
      const userData = updatedData.user || updatedData;

      setFormData({
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        email: userData.email || '',
      });

      // Update the user context
      if (updateUser) {
        updateUser(userData);
      }

      setEditableFields({});
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  if (isLoading) {
    return <PersonalInformationSkeleton />;
  }

  if (!formData) {
    console.log('formData is null or undefined during render.');
    return <div>Error: Unable to load user data</div>;
  }

  return (
    <div className='personal-info-container'>
      <div className='section-header'>
        <h2 className='personal'>Personal Information</h2>
        <img src={leftArrow} alt='Left Arrow' className='left-arrow' />
      </div>
      <p className='description'>
       I seem to have loved you in numberless forms, numberless times,
In life after life, in age after age, forever...
      </p>

      <form className='personal-info-form'>
        <div className='form-group full-name'>
          <label className='font-semibold'>Full Name</label>
          <div className='field-wrapper'>
            <input
              type='text'
              name='fullName'
              value={formData.fullName || ''}
              disabled={!editableFields.fullName}
              onChange={handleInputChange}
              className={`${editableFields.fullName ? 'editable' : 'disabled'}`}
            />
            <button
              type='button'
              className='edit-button'
              onClick={() => enableEditing('fullName')}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
        </div>

        <div className='section-header'>
          <h2 className='contact'>Contact Information</h2>
          <img src={leftArrow} alt='Left Arrow' className='left-arrow' />
        </div>
        <div className='form-row'>
          <div className='form-group'>
            <label className='font-semibold'>Phone Number</label>
            <div className='field-wrapper'>
              <input
                type='text'
                name='phone'
                value={formData.phone || ''}
                disabled={!editableFields.phone}
                onChange={handleInputChange}
                className={`${editableFields.phone ? 'editable' : 'disabled'}`}
              />
              <button
                type='button'
                className='edit-button'
                onClick={() => enableEditing('phone')}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          </div>

          <div className='form-group'>
            <label className='font-semibold'>Email ID</label>
            <div className='field-wrapper'>
              <input
                type='text'
                name='email'
                value={formData.email || ''}
                disabled={!editableFields.email}
                onChange={handleInputChange}
                className={`${editableFields.email ? 'editable' : 'disabled'}`}
              />
              <button
                type='button'
                className='edit-button'
                onClick={() => enableEditing('email')}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {Object.values(editableFields).some((isEditable) => isEditable) && (
        <button onClick={handleSaveChanges} className='brown-deep-button'>
          Save Changes
        </button>
      )}
    </div>
  );
};

export default PersonalInformation;