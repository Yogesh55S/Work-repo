import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null; // Pre-fill if editing
  const [fields, setFields] = useState([]); // Dynamic fields fetched from backend
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch fields dynamically from the backend
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/products/fields'
        );
        const fetchedFields = response.data;
        setFields(fetchedFields);

        // Initialize form data with product details or empty values
        const initialFormData = {};
        fetchedFields.forEach((field) => {
          initialFormData[field.name] =
            product?.[field.name] || (field.type === 'number' ? 0 : '');
        });
        setFormData(initialFormData);
      } catch (err) {
        console.error(
          'Error fetching fields:',
          err.response?.data || err.message
        );
        setError('Failed to fetch form fields.');
      }
    };

    fetchFields();
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (image) form.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const url = product
        ? `http://localhost:8000/api/products/${product._id}`
        : `http://localhost:8000/api/products/add`;
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
      console.error(err.response?.data || 'Error adding/updating product.');
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleCancel = () => {
    navigate('/admin-panel/products');
  };

  const handleSuccessOkay = () => {
    setSuccess(false);
    setFormData(
      fields.reduce((acc, field) => {
        acc[field.name] = field.type === 'number' ? 0 : '';
        return acc;
      }, {})
    );
    setImage(null);
  };

  return (
    <div className='py-5'>
      {success && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
            <h2 className='text-2xl font-bold mb-4 text-green-600'>Success</h2>
            <p className='mb-6'>
              Product {product ? 'updated' : 'added'} successfully.
            </p>
            <button
              onClick={handleSuccessOkay}
              className='bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition'
            >
              Okay
            </button>
          </div>
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
                  value={formData[field.name]}
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
                  value={formData[field.name]}
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
            <input
              id='image'
              type='file'
              onChange={handleImageChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500'
            />
          </div>

          <div className='col-span-2 flex justify-between'>
            <button
              type='button'
              onClick={handleCancel}
              className='bg-gray-500 text-white font-medium py-2 px-4 rounded-md shadow-md transition hover:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className={`${
                product ? 'bg-green-500' : 'bg-blue-500'
              } text-white font-medium py-2 px-4 rounded-md shadow-md transition hover:$
                {product ? "bg-green-600" : "bg-blue-600"}`}
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
