import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      console.error('Google Sign-In failed: No credentials received.');
      if (onError) {
        onError('No credentials received from Google');
      }
      return;
    }

    const { credential } = credentialResponse;
    console.log('Google Token received:', credential);

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google/callback`,
        {
          token: credential,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Google Login API Response:', response.data);

      if (response.data.needRegistration) {
        // Navigate to registration page with Google data
        navigate(
          `/register?email=${encodeURIComponent(response.data.email)}&name=${encodeURIComponent(response.data.name)}&googleId=${response.data.googleId}&profileImg=${encodeURIComponent(response.data.profileImg)}`
        );
      } else if (response.data.token && response.data.user) {
        // Successful login - pass data to parent component
        if (onSuccess) {
          onSuccess(response.data.token, response.data.user);
        }
      } else {
        console.error('Invalid response from server:', response.data);
        if (onError) {
          onError('Invalid response from server');
        }
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error?.response?.data || error.message);
      
      let errorMessage = 'Google Sign-In failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.';
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In failed:', error);
    if (onError) {
      onError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        disabled={disabled || isLoading}
        text="signin_with"
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
      />
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Signing in with Google...
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
