// src/pages/ForgotPassword.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call the backend forgot-password endpoint
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
        setMessage('Reset code sent to your email!');
        // Redirect to OTP verification page instead of directly to reset password
        setTimeout(() => {
          navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } catch (err) {
      console.error('Error sending reset OTP', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 404) {
        setError('No account found with this email address.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-primary'>
      <div className='w-full max-w-md bg-hover shadow-lg rounded-lg p-6 md:p-8'>
        {/* Title */}
        <h1 className='text-3xl font-bold text-center text-button-primary mb-6'>
          Forgot Password
        </h1>
        <p className='text-center text-text text-sm mb-8'>
          Enter your email address and well send you a reset code.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-text mb-1'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary'
              disabled={isLoading}
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

          {/* Submit Button */}
          <button
            type='submit'
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
              isLoading
                ? 'bg-opacity-70 cursor-not-allowed'
                : 'bg-button-primary hover:bg-hover'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
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