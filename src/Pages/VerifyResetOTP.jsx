// src/pages/VerifyResetOTP.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyResetOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL params
  const params = new URLSearchParams(location.search);
  const email = params.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!email) {
      setError('Email is missing. Please try the forgot password process again.');
      return;
    }

    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Call the verify reset OTP endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-reset-otp`,
        {
          email,
          otp
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
if (response.data.success) {
  setMessage('Code verified! Redirecting...');
  setTimeout(() => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}`, {
      state: { verifiedOTP: otp } // Pass OTP through state
    });
  }, 1500);
}
    } catch (err) {
      console.error('OTP verification error:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError('Invalid or expired verification code');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError('Email is missing. Please try the forgot password process again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setMessage('New verification code sent to your email');
        setOtp(''); // Clear the current OTP input
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-primary'>
      <div className='w-full max-w-md bg-hover shadow-lg rounded-lg p-6 md:p-8'>
        {/* Title */}
        <h1 className='text-3xl font-bold text-center text-button-primary mb-6'>
          Verify Reset Code
        </h1>
        <p className='text-center text-text text-sm mb-8'>
          Enter the 6-digit verification code sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Display */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-text mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email || ''}
              className='w-full px-4 py-2 border rounded-lg bg-gray-100 text-button-primary cursor-not-allowed'
              disabled
            />
          </div>

          {/* OTP Input */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-text mb-1'>
              Verification Code
            </label>
            <input
              type='text'
              placeholder='Enter 6-digit code'
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary text-center text-lg tracking-widest'
              disabled={isLoading}
              maxLength={6}
              required
            />
          </div>

          {/* Success Message */}
          {message && (
            <div className='text-center text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg'>
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='text-center text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg'>
              {error}
            </div>
          )}

          {/* Verify Button */}
          <button
            type='submit'
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all mb-4 ${
              isLoading
                ? 'bg-opacity-70 cursor-not-allowed'
                : 'bg-button-primary hover:bg-hover'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          {/* Resend Code Button */}
          <button
            type='button'
            onClick={handleResendOTP}
            className='w-full py-2 rounded-lg border border-button-primary text-button-primary font-semibold hover:bg-button-primary hover:text-white transition-all'
            disabled={isLoading}
          >
            Resend Code
          </button>
        </form>

        {/* Back to Login Link */}
        <p className='text-center text-sm text-text mt-6'>
          Remember your password?{' '}
          <span
            onClick={() => navigate('/login')}
            className='text-button-primary hover:underline cursor-pointer'
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
