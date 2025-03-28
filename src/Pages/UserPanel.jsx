import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Component/providers/AuthContext';
import '../Component/css/UserPanel.css';
import { fetchWithAuth } from '../utils/api';
import blank from './../assets/blank.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

const UserPanel = () => {
  const { token, user, logout } = useAuth();
  const [userData, setUserData] = useState(user || null);
  const [editMode, setEditMode] = useState(false); // To track whether the image editing card is open
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image file (for preview)
  const [imageBase64, setImageBase64] = useState(userData?.profileImg || ''); // To track the profile image URL
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const breadcrumbs = {
    profile: 'Profile',
    'address-book': 'Address Book',
    orders: 'Orders',
    payment: 'Payment',
    security: 'Security',
    'help-support': 'Help & Support',
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No token found in AuthContext.');
        return;
      }

      if (!userData) {
        try {
          const data = await fetchWithAuth(`${API_URL}/profile`, token);
          setUserData(data);
          setImageBase64(data.profileImage || '');
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
          if (error.message.includes('Unauthorized')) {
            logout();
          }
        }
      }
    };

    fetchUserData();
  }, [API_URL, token, userData, logout]);

  // Function to handle image upload and convert to base64 for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set the base64 string for preview
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  // Issue in profile image display !!!
  // Function to save the image and store it in backend
  const handleSaveImage = async () => {
    if (!selectedImage) return;

    // Create a new Image object to get its size
    const image = selectedImage.split(',')[1]; // Extract the base64 image data
    const byteLength = atob(image).length; // Decode base64 and check the length

    // Convert to KB/MB for better readability
    const imageSizeInMB = byteLength / (1024 * 1024);

    if (imageSizeInMB > 5) {
      alert('Image size exceeds 5MB limit.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileImgBase64: selectedImage }),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUserData(updatedUserData.user); // Update user data
        setImageBase64(updatedUserData.user.profileImg); // Update profile image in UI
        setEditMode(false); // Close the edit card
        fetchUserImage(); // Fetch the updated profile image from backend
      } else {
        console.error('Error updating profile image');
      }
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  // Function to fetch the profile image after upload or on page load
  const fetchUserImage = async () => {
    try {
      const data = await fetchWithAuth(`${API_URL}/profile`, token);
      if (data.profileImg) {
        setImageBase64(data.profileImg);
      } else {
        setImageBase64(''); // Set to Blank if no image found
      }
    } catch (error) {
      console.error('Error fetching profile image: ', error.message);
    }
  };

  return (
    <div className='user-panel-container'>
      <div className='user-panel'>
        <div className='user-sidebar'>
          <div className='user-profile'>
            <div className='account space-y-2'>
              <p className='my-account'>My Account</p>
              <div className='profile-image-container'>
                <div className='profile-image'>
                  <img
                    src={imageBase64 || blank}
                    alt='User Avatar'
                    className='profile-img'
                  />
                </div>
                <button
                  className='edit-profile'
                  onClick={() => setEditMode(true)}
                >
                  <FontAwesomeIcon icon={faCamera} />
                </button>
              </div>
              <p className='user-name'>{userData?.fullName || 'User Name'}</p>
              <p className='user-email'>
                {userData?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <ul className='sidebar-links'>
            {[
              { label: 'Profile', path: 'profile' },
              { label: 'Address Book', path: 'address-book' },
              { label: 'Orders', path: 'orders' },
              { label: 'Payment', path: 'payment' },
              { label: 'Security', path: 'security' },
              { label: 'Help & Support', path: 'help-support' },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${
                    location.pathname.includes(item.path) ? 'active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Edit Profile Image Card */}
        {editMode && (
          <div className='image-edit-card'>
            <div className='image-edit-card-content'>
              <button
                className='close-button'
                onClick={() => setEditMode(false)} // Close the image upload card
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div className='image-preview'>
                <img
                  src={selectedImage || imageBase64 || blank}
                  alt='Selected Profile'
                  className='preview-img'
                />
              </div>
              {/* Custom "Upload Image" Button */}
              <div className='upload-button-container'>
                <button
                  className='brown-deep-button mt-5'
                  onClick={() =>
                    document.getElementById('image-upload').click()
                  } // Trigger file input click on button click
                >
                  Upload Image
                </button>
                <input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange} // Handle file selection
                  className='image-upload-input'
                />
              </div>
              <div className='modal-actions'>
                <button
                  className='cancel-btn'
                  onClick={() => setEditMode(false)} // Cancel and close the card
                >
                  Cancel
                </button>
                <button className='save-btn' onClick={handleSaveImage}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='user-content'>
          {/* Breadcrumb Navigation */}
          <div className='breadcrumb-container'>
            <p className='breadcrumb'>
              My Account &gt;&gt;{' '}
              {breadcrumbs[location.pathname.split('/').pop()] || 'Profile'}
            </p>
          </div>
          <Outlet context={{ userData }} />
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
