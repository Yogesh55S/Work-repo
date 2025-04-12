import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Component/providers/AuthContext';
import '../Component/css/UserPanel.css';
import { fetchWithAuth } from '../utils/api';
import blank from './../assets/blank.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

const UserPanel = () => {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const breadcrumbs = {
    profile: 'Profile',
    'address-book': 'Address Book',
    orders: 'Orders',
    security: 'Security',
    'help-support': 'Help & Support',
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No token found in AuthContext.');
        return;
      }

      setLoading(true); // Start loading
      try {
        const response = await fetchWithAuth('profile', token);
        // Check if response has user property
        const data = response.user || response;
        setUserData(data);

        // Set the image base64 data with proper data URI
        if (data.profileImg) {
          // Always ensure we have the complete data URI
          const base64Data = data.profileImg.startsWith('data:')
            ? data.profileImg
            : `data:image/jpeg;base64,${data.profileImg}`;
          setImageBase64(base64Data);
        } else {
          setImageBase64('');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        if (error.message.includes('Unauthorized')) {
          logout();
        }
      } finally {
        setLoading(false); // End loading regardless of success/failure
      }
    };

    fetchUserData();
  }, [token, API_URL, logout]);

  // Function to handle image upload and convert to base64 for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to save the image and store it in backend
  const handleSaveImage = async () => {
    if (!selectedImage) return;

    // Create a new Image object to get its size
    const image = selectedImage.split(',')[1];
    const byteLength = atob(image).length;
    const imageSizeInMB = byteLength / (1024 * 1024);

    if (imageSizeInMB > 5) {
      toast.error('Image size exceeds 5MB limit.');
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
        // Check if response has user property
        const data = updatedUserData.user || updatedUserData;
        setUserData(data);

        // Update the image base64 data with proper data URI
        if (data.profileImg) {
          const base64Data = data.profileImg.startsWith('data:')
            ? data.profileImg
            : `data:image/jpeg;base64,${data.profileImg}`;
          setImageBase64(base64Data);
        } else {
          setImageBase64('');
        }
        setEditMode(false);
      } else {
        console.error('Error updating profile image');
      }
    } catch (error) {
      console.error('Error saving profile image:', error);
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
                {loading ? (
                  <div className='skeleton-image'></div>
                ) : (
                  <div className='profile-image'>
                    <img
                      src={imageBase64 || blank}
                      alt='User Avatar'
                      className='profile-img'
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        e.target.src = blank;
                      }}
                    />
                  </div>
                )}
                {!loading && (
                  <button
                    className='edit-profile'
                    onClick={() => setEditMode(true)}
                    aria-label='Edit profile picture'
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                )}
              </div>
              {loading ? (
                <div className='skeleton-container'>
                  <div className='skeleton-text skeleton-name'></div>
                  <div className='skeleton-text skeleton-email'></div>
                </div>
              ) : (
                <>
                  <p className='user-name'>
                    {userData?.fullName || 'User Name'}
                  </p>
                  <p className='user-email'>
                    {userData?.email || 'user@example.com'}
                  </p>
                </>
              )}
            </div>
          </div>
          <ul className='sidebar-links'>
            {[
              { label: 'Profile', path: 'profile' },
              { label: 'Address Book', path: 'address-book' },
              { label: 'Orders', path: 'orders' },
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
