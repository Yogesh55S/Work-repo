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
    setIsLoading(true);

    try {
      // Call the backend forgot-password endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(response.data.message);
      // Optionally redirect to the reset password page (passing email via query parameter)
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Error sending OTP', err);
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
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-text mb-1'>
              Email
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
