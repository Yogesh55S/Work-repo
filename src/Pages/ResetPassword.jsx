// src/pages/ResetPassword.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the email from query parameters (passed from ForgotPassword)
  const params = new URLSearchParams(location.search);
  const email = params.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is missing. Please try again.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // Call the backend reset-password endpoint with email, OTP, and new password
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { email, otp, newPassword }
      );
      setMessage(response.data.message);
      // After successful password reset, redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error resetting password', err);
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          'An error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-primary'>
      <div className='w-full max-w-md bg-hover shadow-lg rounded-lg p-6 md:p-8'>
        <h1 className='text-3xl font-bold text-center text-button-primary mb-6'>
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-text mb-1'>
              OTP
            </label>
            <input
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-text mb-1'>
              New Password
            </label>
            <input
              type='password'
              placeholder='Enter new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-text mb-1'>
              Confirm Password
            </label>
            <input
              type='password'
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary'
              required
            />
          </div>
          {error && (
            <p className='text-center text-red-600 text-sm mb-4'>{error}</p>
          )}
          {message && (
            <p className='text-center text-green-600 text-sm mb-4'>{message}</p>
          )}
          <button
            type='submit'
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
              isLoading
                ? 'bg-opacity-70 cursor-not-allowed'
                : 'bg-button-primary hover:bg-hover'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
