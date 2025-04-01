import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleEdit = (product) => {
    navigate('/admin-panel/add-product', { state: { product } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not authorized to perform this action.');
          return;
        }

        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(products.filter((product) => product._id !== id));
        setSuccessMessage('Product deleted successfully.');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product.');
      }
    }
  };

  const closePopup = () => {
    setError('');
    setSuccessMessage('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='py-5'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-6'>Product List</h1>
        {/* Buttons to take a look for closePopup Function*/}
        {error && (
          <div className='bg-red-100 text-red-600 px-4 py-2 rounded mb-4 flex justify-between items-center'>
            <span>{error}</span>
            <button onClick={closePopup} className='text-red-600 font-bold'>
              Close
            </button>
          </div>
        )}
        {successMessage && (
          <div className='bg-green-100 text-green-600 px-4 py-2 rounded mb-4 flex justify-between items-center'>
            <span>{successMessage}</span>
            <button onClick={closePopup} className='text-green-600 font-bold'>
              Close
            </button>
          </div>
        )}
        {products.length === 0 ? (
          <div>No products available.</div>
        ) : (
          <div className='flex flex-col gap-6'>
            {products.map((product) => (
              <div
                key={product._id}
                className='flex flex-col sm:flex-row border rounded-lg shadow-md bg-white overflow-hidden'
              >
                <img
                  src={`${API_URL.replace('/api', '')}/${product.image.replace(
                    /\\/g,
                    '/'
                  )}`}
                  alt={product.productName}
                  className='w-full sm:w-1/3 h-48 object-cover'
                  onError={(e) =>
                    (e.target.src = 'https://via.placeholder.com/150')
                  }
                />
                <div className='p-4 flex flex-col justify-between flex-grow'>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      {product.productName}
                    </h2>
                    <p className='text-gray-600 text-sm'>
                      {product.description}
                    </p>
                    <p className='text-gray-800 font-bold mt-2'>
                      Price: ${product.price}
                    </p>
                    <p className='text-gray-600 mt-1'>
                      <strong>Type:</strong> {product.type}{' '}
                      {product.subType && `> ${product.subType}`}
                    </p>
                    <p className='text-gray-600 mt-1'>
                      <strong>Weight:</strong> {product.itemWeight}
                    </p>
                    <p className='text-gray-600 mt-1'>
                      <strong>Quantity:</strong> {product.netQuantity}
                    </p>
                    {product.ingredients && (
                      <p className='text-gray-600 mt-1'>
                        <strong>Ingredients:</strong> {product.ingredients}
                      </p>
                    )}
                    {product.allergenInformation && (
                      <p className='text-gray-600 mt-1'>
                        <strong>Allergen Information:</strong>{' '}
                        {product.allergenInformation}
                      </p>
                    )}
                    {product.directionsToUse && (
                      <p className='text-gray-600 mt-1'>
                        <strong>Directions to Use:</strong>{' '}
                        {product.directionsToUse}
                      </p>
                    )}
                    <p className='text-gray-600 mt-1'>
                      <strong>Use Before:</strong> {product.useBefore}
                    </p>
                  </div>
                  <div className='flex justify-between items-center mt-4'>
                    <button
                      onClick={() => handleEdit(product)}
                      className='bg-blue-500 text-white px-4 py-2 rounded shadow'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className='bg-red-500 text-white px-4 py-2 rounded shadow'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;
