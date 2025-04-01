import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(600);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVerifyOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { email, otp }
      );

      if (
        res.data.message === 'User verified successfully. You can now log in.'
      ) {
        setSuccessMessage('Verification successful! Redirecting to login...');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        setErrorMessage(res.data.message || 'Invalid OTP or OTP has expired');
      }
    } catch (error) {
      setErrorMessage('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        { email }
      );

      if (res.data.message) {
        setSuccessMessage('OTP resent successfully! Check your email.');
        setTimer(100);
      }
    } catch {
      setErrorMessage('Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-[90vh] bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-3xl font-bold mb-6 text-center text-[#004B65]'>
          Verify OTP
        </h1>

        <input
          type='text'
          placeholder='Enter OTP'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className='w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none'
        />

        <button
          onClick={handleVerifyOTP}
          className='w-full bg-[#004B65] text-white py-2 px-4 rounded-lg'
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <p className='mt-4 text-center'>
          OTP expires in: <span className='font-bold'>{formatTime(timer)}</span>
        </p>

        <button
          onClick={handleResendOTP}
          className='w-full mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg'
          disabled={isResending || timer > 0}
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>

        {errorMessage && (
          <p className='text-red-500 text-center mt-4'>{errorMessage}</p>
        )}
        {successMessage && (
          <p className='text-green-500 text-center mt-4'>{successMessage}</p>
        )}
      </div>
    </div>
  );
}
