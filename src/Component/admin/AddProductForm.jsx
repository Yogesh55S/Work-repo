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
  const [isInitialLoading, setIsInitialLoading] = useState(true); // New state for initial loading

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch product if needed
  useEffect(() => {
    const fetchProduct = async () => {
      if (id && !location.state?.product) {
        try {
          const response = await axios.get(`${API_URL}/products/${id}`);
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
      setIsInitialLoading(true); // Start initial loading
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
        // Add a small delay to prevent flickering
        setTimeout(() => {
          setIsInitialLoading(false); // End initial loading
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
    setIsLoading(true); // Start loading

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

      const token = localStorage.getItem('token');
      const url = product
        ? `${API_URL}/products/${product._id}`
        : `${API_URL}/products/add`;
      const method = product ? 'put' : 'post';

      await axios({
        method,
        url,
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(
        err.response?.data?.message ||
          'Failed to save product. Please try again.'
      );
    } finally {
      setIsLoading(false); // Stop loading
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
    <div className='py-5'>
      {success && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
            <h2 className='text-2xl font-bold mb-4 text-green-600'>Success</h2>
            <p className='mb-6'>
              {product
                ? 'Product updated successfully! Returning to product list.'
                : 'Product added successfully! You can add another product.'}
            </p>
            <button
              onClick={handleSuccessOkay}
              className='bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition'
            >
              {product ? 'View Products' : 'Add Another'}
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay for form submission */}
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-50'>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className='text-white text-4xl mb-3'
          />
          <p className='text-white font-medium text-lg'>
            Processing. Please Do Not Refresh...
          </p>
        </div>
      )}

      <div
        className={`max-w-5xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg ${
          success ? 'opacity-25' : 'opacity-100'
        }`}
      >
        <h1 className='text-3xl font-bold text-center mb-6'>
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
        >
          {fields.map((field) => (
            <div key={field.name} className='col-span-1'>
              <label
                htmlFor={field.name}
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                {field.label}{' '}
                {field.name === 'netQuantity' && (
                  <span className='text-sm text-gray-500'>
                    (e.g., g, pcs, ml)
                  </span>
                )}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500'
                  required={field.required}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500'
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className='col-span-2'>
            <label
              htmlFor='image'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Product Image
            </label>

            {/* Show preview of newly selected image */}
            {previewUrl ? (
              <div className='mb-2'>
                <p className='text-sm text-green-500 mb-1'>
                  New image preview:
                </p>
                <img
                  src={previewUrl}
                  alt='Image preview'
                  className='h-40 object-contain border border-gray-200 rounded p-1 mb-2'
                />
              </div>
            ) : (
              // Only show current image if no new image is selected
              product &&
              product.image && (
                <div className='mb-2'>
                  <p className='text-sm text-gray-500 mb-1'>Current image:</p>
                  <img
                    src={product.image}
                    alt={product.productName}
                    className='h-40 object-contain border border-gray-200 rounded p-1 mb-2'
                  />
                </div>
              )
            )}

            <input
              id='image'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500'
              required={!product} // Required for new products, optional for edits
            />
            {image && (
              <p className='text-sm text-green-500 mt-1'>
                New image selected: {image.name}
              </p>
            )}
          </div>

          <div className='col-span-2 flex justify-between'>
            <button
              type='button'
              onClick={handleCancel}
              className='bg-gray-500 text-white font-medium py-2 px-4 rounded-md shadow-md transition hover:bg-gray-600'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={`${
                product ? 'bg-green-500' : 'bg-blue-500'
              } text-white font-medium py-2 px-4 rounded-md shadow-md transition hover:${
                product ? 'bg-green-600' : 'bg-blue-600'
              }`}
              disabled={isLoading}
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
