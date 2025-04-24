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

  // Function to determine badge color based on product type
  const getTypeBadgeColors = (type) => {
    const typeColorMap = {
      'Skin Care': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Body Care': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
      'Hair Care': { bg: 'bg-amber-100', text: 'text-amber-800' },
      'Soap Bars': { bg: 'bg-purple-100', text: 'text-purple-800' },
    };

    // Default color if type doesn't match any in our map
    return typeColorMap[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='py-8 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Product Management
          </h1>
          <button
            onClick={() => navigate('/admin-panel/add-product')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-colors duration-300 flex items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Add New Product
          </button>
        </div>

        {error && (
          <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md flex justify-between items-center'>
            <div className='flex items-center'>
              <svg
                className='h-6 w-6 mr-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={closePopup}
              className='text-red-700 hover:text-red-800 font-medium'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        )}

        {successMessage && (
          <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-md flex justify-between items-center'>
            <div className='flex items-center'>
              <svg
                className='h-6 w-6 mr-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
              <span>{successMessage}</span>
            </div>
            <button
              onClick={closePopup}
              className='text-green-700 hover:text-green-800 font-medium'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className='bg-white p-8 rounded-lg shadow-md text-center'>
            <svg
              className='h-16 w-16 text-gray-400 mx-auto mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
              />
            </svg>
            <p className='text-xl text-gray-600'>No products available.</p>
            <button
              onClick={() => navigate('/admin-panel/add-product')}
              className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {products.map((product) => {
              const typeColors = getTypeBadgeColors(product.type);

              return (
                <div
                  key={product._id}
                  className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
                >
                  <div className='flex flex-col sm:flex-row'>
                    <div className='sm:w-1/3 relative'>
                      <img
                        src={product.image || 'https://via.placeholder.com/200'}
                        alt={product.productName}
                        className='w-full h-full object-cover'
                        style={{ minHeight: '200px' }}
                      />
                      <div className='absolute top-2 right-2  p-1 rounded-full '>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}
                        >
                          {product.type}
                        </span>
                      </div>
                    </div>

                    <div className='p-6 sm:w-2/3 flex flex-col justify-between'>
                      <div>
                        <div className='flex justify-between items-start'>
                          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                            {product.productName}
                          </h2>
                          <span className='text-xl font-bold text-green-600'>
                            ₹{product.price}
                          </span>
                        </div>

                        <p className='text-gray-600 mb-4 line-clamp-2'>
                          {product.description}
                        </p>

                        <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4'>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Type:
                            </span>{' '}
                            <span className={`${typeColors.text} font-medium`}>
                              {product.type}
                            </span>
                            {product.subType && (
                              <span> &gt; {product.subType}</span>
                            )}
                          </div>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Weight:
                            </span>{' '}
                            {product.itemWeight}
                          </div>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Quantity:
                            </span>{' '}
                            {product.netQuantity}
                          </div>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Use Before:
                            </span>{' '}
                            {product.useBefore}
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-1 mb-2'>
                          {product.ingredients && (
                            <div className='w-full'>
                              <details className='text-sm'>
                                <summary className='font-medium text-gray-700 cursor-pointer hover:text-gray-900'>
                                  Ingredients
                                </summary>
                                <p className='mt-1 text-gray-600 pl-2'>
                                  {product.ingredients}
                                </p>
                              </details>
                            </div>
                          )}

                          {product.allergenInformation && (
                            <div className='w-full'>
                              <details className='text-sm'>
                                <summary className='font-medium text-gray-700 cursor-pointer hover:text-gray-900'>
                                  Allergen Information
                                </summary>
                                <p className='mt-1 text-gray-600 pl-2'>
                                  {product.allergenInformation}
                                </p>
                              </details>
                            </div>
                          )}

                          {product.directionsToUse && (
                            <div className='w-full'>
                              <details className='text-sm'>
                                <summary className='font-medium text-gray-700 cursor-pointer hover:text-gray-900'>
                                  Directions to Use
                                </summary>
                                <p className='mt-1 text-gray-600 pl-2'>
                                  {product.directionsToUse}
                                </p>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex justify-between items-center pt-4 border-t border-gray-100 mt-4'>
                        <button
                          onClick={() => handleEdit(product)}
                          className='flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-300'
                        >
                          <svg
                            className='w-4 h-4 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            />
                          </svg>
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className='flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-300'
                        >
                          <svg
                            className='w-4 h-4 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;
