import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './providers/AuthContext'; // Assuming useAuth is available

const GoogleSignInButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login method from AuthContext

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      console.error('Google Sign-In failed: No credentials received.');
      return;
    }

    const { credential } = credentialResponse;

    // Log the Google token here
    console.log('Google Token received:', credential);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google/callback`, {
        token: credential,
      });

      if (res.data.needRegistration) {
        navigate(`/auth/register?email=${res.data.email}&name=${res.data.name}`);
      } else {
        // Save token and user data locally
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Update the auth context to trigger a re-render of Navbar
        login(res.data.user);

        navigate('/');
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error?.response?.data || error.message);
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Sign-In failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleFailure}
    />
  );
};

export default GoogleSignInButton;
