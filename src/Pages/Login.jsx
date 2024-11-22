import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        login(response.data.user);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google/callback`, {
        token: credentialResponse.credential,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        login(response.data.user);
        navigate('/');
      }
    } catch {
      setErrorMessage('Google login failed. Please try again.');
    }
  };

  const handleGoogleFailure = () => setErrorMessage('Google login failed. Please try again.');

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#004B65]">Login</h1>

        <div className="mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none"
          />
        </div>

        <button
          onClick={handleEmailLogin}
          className="w-full bg-[#004B65] text-white py-2 px-4 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="my-6">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        </div>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-[#004B65] hover:underline cursor-pointer"
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
