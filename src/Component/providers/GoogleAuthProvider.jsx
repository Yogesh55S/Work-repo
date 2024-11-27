import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId);

const GoogleAuthProvider = ({ children }) => {
  if (!clientId) {
    console.error("Google Client ID is missing! Please set 'VITE_GOOGLE_CLIENT_ID' in your .env file.");
    return <div>Error: Google Client ID not found</div>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};

export default GoogleAuthProvider;
