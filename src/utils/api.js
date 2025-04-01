export const fetchWithAuth = async (endpoint, token, options = {}) => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint;
    const response = await fetch(`${API_URL}/${cleanEndpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token');
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchWithAuth:', error.message);
    throw error;
  }
};
