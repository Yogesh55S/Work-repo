import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import '../css/PersonalInformation.css';
import leftArrow from '../../assets/svg/leftarrow.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const PersonalInformation = () => {
  const { token } = useAuth();
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
      const user = data.user || {};
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
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

  const handleSaveChanges = async () => {
    try {
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
      const user = updatedData.user || updatedData;

      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
      });

      setEditableFields({});
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
        Lorem ipsum odor amet, consectetuer adipiscing elit. Sed faucibus morbi
        curae maecenas dignissim volutpat hac quam.
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
