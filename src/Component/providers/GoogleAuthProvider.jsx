import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './AuthContext'; // Import useAuth hook

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Added import for prop-validation here
import PropTypes from 'prop-types';

const GoogleAuthProvider = ({ children }) => {
  const { login } = useAuth(); // Access login function from AuthContext

  const handleGoogleSuccess = (response) => {
    const token = response.credential; // Get Google JWT token
    const userData = parseJwt(token); // Parse the token to extract user data

    // Save Google token and user data using AuthContext's login
    login(userData, token);
  };

  // Helper function to decode JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return null;
    }
  };

  if (!clientId) {
    console.error(
      "Google Client ID is missing! Please set 'VITE_GOOGLE_CLIENT_ID' in your .env file."
    );
    return <div>Error: Google Client ID not found</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {React.cloneElement(children, { onGoogleSuccess: handleGoogleSuccess })}
    </GoogleOAuthProvider>
  );
};

// PropTypes validation for GoogleAuthProvider
GoogleAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GoogleAuthProvider;
