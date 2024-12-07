import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', token); // Log token before sending request

        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Response from server:', response.data); // Log response data
        setProfile(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err.message);

        if (err.response) {
          console.log('Error response details:', err.response); // Log error response
        }

        if (err.response?.status === 401) {
          // Redirect to login if unauthorized
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch user profile.');
        }

        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="space-y-4">
        <p><strong>Full Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Address:</strong> {profile.address || 'Not provided'}</p>
      </div>
    </div>
  );
};

export default UserProfile;
