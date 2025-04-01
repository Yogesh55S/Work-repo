import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromGoogle = new URLSearchParams(location.search).get('email');
  const nameFromGoogle = new URLSearchParams(location.search).get('name');

  const [fullName, setFullName] = useState(nameFromGoogle || '');
  const [email, setEmail] = useState(emailFromGoogle || '');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!fullName) errors.fullName = 'Full name is required';
    if (!email || !emailRegex.test(email))
      errors.email = 'Please enter a valid email address';
    if (!phone || !phoneRegex.test(phone))
      errors.phone = 'Please enter a valid 10-digit phone number';
    if (!password || !passwordRegex.test(password)) {
      errors.password =
        'Password must include one uppercase, one lowercase, one number, and one special character';
    }
    if (password !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    setErrorMessage({});
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          fullName,
          email,
          phone,
          password,
        }
      );

      if (res.status === 201) {
        setSuccessMessage(
          'Registration successful! Redirecting to OTP verification...'
        );
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setErrorMessage({ general: res.data.message || 'Registration failed' });
      }
    } catch (error) {
      setErrorMessage({
        general:
          error.response?.data?.message ||
          'Registration failed: User already exists or server error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-primary'>
      <div className='w-full max-w-md bg-hover shadow-lg rounded-lg p-6 md:p-8'>
        {/* Title */}
        <h1 className='text-3xl font-bold text-center text-button-primary mb-6'>
          Create an Account
        </h1>
        <p className='text-center text-text text-sm mb-8'>
          Register to start your journey with us.
        </p>

        {/* Full Name */}
        <input
          type='text'
          placeholder='Full Name'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary mb-4'
        />
        {errorMessage.fullName && (
          <p className='text-red-500 text-sm'>{errorMessage.fullName}</p>
        )}

        {/* Email */}
        <input
          type='email'
          placeholder='Email'
          value={email}
          readOnly={!!emailFromGoogle}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary mb-4'
        />
        {errorMessage.email && (
          <p className='text-red-500 text-sm'>{errorMessage.email}</p>
        )}

        {/* Phone */}
        <input
          type='tel'
          placeholder='Phone Number'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary mb-4'
        />
        {errorMessage.phone && (
          <p className='text-red-500 text-sm'>{errorMessage.phone}</p>
        )}

        {/* Password */}
        <div className='relative mb-4'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-2 text-sm text-button-primary'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errorMessage.password && (
          <p className='text-red-500 text-sm'>{errorMessage.password}</p>
        )}

        {/* Confirm Password */}
        <div className='relative mb-6'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-2 text-sm text-button-primary'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errorMessage.confirmPassword && (
          <p className='text-red-500 text-sm'>{errorMessage.confirmPassword}</p>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
            isLoading
              ? 'bg-opacity-70 cursor-not-allowed'
              : 'bg-button-primary hover:bg-hover'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {errorMessage.general && (
          <p className='text-red-500 text-center mt-4'>
            {errorMessage.general}
          </p>
        )}
        {successMessage && (
          <p className='text-green-500 text-center mt-4'>{successMessage}</p>
        )}

        {/* Login Link */}
        <p className='text-center text-sm text-text mt-6'>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className='text-button-primary hover:underline cursor-pointer'
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
