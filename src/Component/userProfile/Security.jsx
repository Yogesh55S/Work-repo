import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import SecuritySkeleton from '../skeletons/SecuritySkeleton'; // Import the skeleton component

const Security = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error('No token found in AuthContext.');
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const data = await response.json();
        console.log('Fetched data from backend:', data);

        const user = data.user || {};
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
        });

        setIsGoogleUser(!!user.googleId);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const showMessage = (text, type = 'success') => {
    setPopupMessage({ text, type });
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const requestOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) throw new Error('Failed to send OTP');

      setOtpSent(true);
      toast.success('OTP sent to your email.');
    } catch (error) {
      toast.error('Error sending OTP: ' + error.message);
    }
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      toast.warning('New passwords do not match.');
      return;
    }

    if (!otpSent) {
      requestOtp();
      return;
    }

    if (!otp) {
      toast.warning('Please enter the OTP sent to your email.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
          newPassword,
        }),
      });

      if (!response.ok) throw new Error('Failed to update password');

      // Clear fields after successful password update
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpSent(false);

      toast.success('Password updated successfully.');
    } catch (error) {
      toast.error('Error updating password: ' + error.message);
    }
  };

  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setOtpSent(false);
    showMessage('Password update canceled.', 'info');
  };

  // Show skeleton while loading
  if (loading) {
    return <SecuritySkeleton />;
  }

  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='max-w-lg px-6 security-container'>
      <div className='section-header'>
        <h2 className='personal'>Security Settings</h2>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className={`popup-overlay`}>
          <div className={`popup-box ${popupMessage.type}`}>
            <p>{popupMessage.text}</p>
          </div>
        </div>
      )}

      {isGoogleUser ? (
        <div className='text-gray-700'>
          <p>
            You signed in using Google. Manage your account through Google
            settings.
          </p>
        </div>
      ) : (
        <form className='space-y-6'>
          <div className='form-group'>
            <label className='font-semibold'>Email ID</label>
            <input
              type='text'
              name='email'
              value={formData?.email || ''}
              disabled
              className='disabled'
            />
          </div>

          {/* Password Fields */}
          {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field} className='form-group'>
              <label className='font-semibold'>
                {field === 'oldPassword'
                  ? 'Old Password'
                  : field === 'newPassword'
                  ? 'New Password'
                  : 'Confirm New Password'}
              </label>
              <div className='field-wrapper'>
                <input
                  type={showPassword[field] ? 'text' : 'password'}
                  name={field}
                  value={
                    field === 'oldPassword'
                      ? oldPassword
                      : field === 'newPassword'
                      ? newPassword
                      : confirmPassword
                  }
                  onChange={(e) =>
                    field === 'oldPassword'
                      ? setOldPassword(e.target.value)
                      : field === 'newPassword'
                      ? setNewPassword(e.target.value)
                      : setConfirmPassword(e.target.value)
                  }
                  required
                  className='input-style'
                />
                <button
                  type='button'
                  className='eye-button'
                  onClick={() => togglePasswordVisibility(field)}
                >
                  <FontAwesomeIcon
                    icon={showPassword[field] ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>
          ))}

          {/* OTP field that appears after sending OTP */}
          {otpSent && (
            <div className='form-group'>
              <label className='font-semibold'>OTP</label>
              <input
                type='text'
                name='otp'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className='input-style'
                placeholder='Enter OTP sent to your email'
              />
            </div>
          )}

          <div className='button-group'>
            <button
              type='button'
              onClick={handleSaveChanges}
              className='brown-deep-button'
            >
              {otpSent ? 'UPDATE PASSWORD' : 'SEND OTP'}
            </button>
            <button
              type='button'
              onClick={handleCancel}
              className='border border-red-500 text-red-500 px-4 ml-5 py-2 rounded-md hover:bg-red-100 transition'
            >
              CANCEL
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Security;
