import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ProductFormSkeleton from './ProductFormSkeleton';

const AddProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(location.state?.product || null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch product if needed
  useEffect(() => {
    const fetchProduct = async () => {
      if (id && !location.state?.product) {
        try {
          const response = await axios.get(`${API_URL}/products/${id}`, {
            headers: {
              'X-Admin-Request': 'true' // Add admin header for proper response format
            }
          });
          setProduct(response.data);
        } catch (err) {
          console.error('Error fetching product:', err);
          setError('Failed to load product data');
        }
      }
    };
    fetchProduct();
  }, [id, location.state, API_URL]);

  // Fetch fields and set form data
  useEffect(() => {
    const fetchFields = async () => {
      setIsInitialLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products/fields`);
        const fetchedFields = response.data.filter(
          (field) => field.name !== 'createdBy'
        );
        setFields(fetchedFields);

        // Initialize form data with product details or empty values
        const initialFormData = {};
        fetchedFields.forEach((field) => {
          initialFormData[field.name] =
            product?.[field.name] || (field.type === 'number' ? 0 : '');
        });
        setFormData(initialFormData);
      } catch (err) {
        console.error('Error fetching fields:', err);
        setError('Failed to fetch form fields');
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 300);
      }
    };

    fetchFields();
  }, [product, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Clean up previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      // Create preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));

      if (image) {
        form.append('image', image);
      } else if (!product) {
        setError('Please select an image for the product');
        setIsLoading(false);
        return;
      }

      // CHANGED: Use 'authToken' instead of 'token'
      const token = localStorage.getItem('authToken');
      
      // CHANGED: Handle both id formats for product updates
      const url = product
        ? `${API_URL}/products/${product.id || product._id}`
        : `${API_URL}/products/add`;
      const method = product ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Product saved successfully:', response.data);
      setSuccess(true);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        'Failed to save product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-panel/products');
  };

  const handleSuccessOkay = () => {
    if (product) {
      // If editing, navigate back to products list
      navigate('/admin-panel/products');
    } else {
      // If adding new product, just reset the form
      setSuccess(false);
      // Reset form to initial state
      setFormData(
        fields.reduce((acc, field) => {
          acc[field.name] = field.type === 'number' ? 0 : '';
          return acc;
        }, {})
      );
      setImage(null);
      setPreviewUrl(null);
      setError('');
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Show skeleton during initial loading
  if (isInitialLoading) {
    return <ProductFormSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Success!
              </h3>
              <p className="text-gray-600 mb-4">
                {product
                  ? 'Product updated successfully! Returning to product list.'
                  : 'Product added successfully! You can add another product.'}
              </p>
              <button
                onClick={handleSuccessOkay}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />
              <span className="text-gray-700">
                Processing. Please Do Not Refresh...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Image *
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {(previewUrl || product?.image) && (
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl || product?.image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label || field.name} {field.required && '*'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field.label || field.name}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    step={field.type === 'number' ? '0.01' : undefined}
                    min={field.type === 'number' ? '0' : undefined}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field.label || field.name}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  {product ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                product ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
