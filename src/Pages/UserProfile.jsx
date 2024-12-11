import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect if no token
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data.user);
        setFormData(response.data.user); // Populate form data
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data.user);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-3xl bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        User Profile
      </h1>

      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block font-medium text-gray-700 mb-1">
              Full Name:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="address" className="block font-medium text-gray-700 mb-1">
              Address:
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="font-medium text-gray-700">Full Name:</strong> {profile?.fullName}
          </p>
          <p className="text-lg">
            <strong className="font-medium text-gray-700">Email:</strong> {profile?.email}
          </p>
          <p className="text-lg">
            <strong className="font-medium text-gray-700">Phone:</strong> {profile?.phone}
          </p>
          <p className="text-lg">
            <strong className="font-medium text-gray-700">Address:</strong> {profile?.address || 'Not provided'}
          </p>
          <div className="text-center mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
