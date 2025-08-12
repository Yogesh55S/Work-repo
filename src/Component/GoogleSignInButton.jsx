import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleSignInButton = ({ onGoogleSuccess }) => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      console.error('Google Sign-In failed: No credentials received.');
      return;
    }

    const { credential } = credentialResponse;

    console.log('Google Token received:', credential); // Debug Google token

    try { 
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google/callback`,
        {
          token: credential,
        }
      );

      console.log('Google Login API Response:', res.data); // Debug the backend response

      if (res.data.needRegistration) {
        navigate(
          `/auth/register?email=${res.data.email}&name=${res.data.name}`
        );
      } else if (onGoogleSuccess) {
        // Pass token and user data to the parent component for handling
        onGoogleSuccess(res.data.token, res.data.user);
      }
    } catch (error) {
      console.error(
        'Google Sign-In failed:',
        error?.response?.data || error.message
      );
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
