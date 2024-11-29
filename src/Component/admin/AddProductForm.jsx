import React, { useState } from 'react';
import axios from 'axios';

const fields = [
  { name: 'productName', type: 'text', placeholder: 'Product Name', label: 'Product Name', required: true },
  { name: 'description', type: 'textarea', placeholder: 'Description', label: 'Description', required: true },
  { name: 'price', type: 'number', placeholder: 'Price', label: 'Price', required: true },
  { name: 'directionsToUse', type: 'textarea', placeholder: 'Directions to Use', label: 'Directions to Use', required: false },
  { name: 'ingredients', type: 'textarea', placeholder: 'Ingredients (comma-separated)', label: 'Ingredients', required: false },
  { name: 'allergenInformation', type: 'textarea', placeholder: 'Allergen Information', label: 'Allergen Information', required: false },
  { name: 'useBefore', type: 'text', placeholder: 'Use Before (Expiry Date)', label: 'Use Before', required: true },
  { name: 'genericName', type: 'text', placeholder: 'Generic Name (e.g., Shampoo)', label: 'Generic Name', required: false },
];

const productTypes = ['Body Care', 'Skin Care', 'Hair Care', 'Soap Bars'];
const units = ['gm', 'ml', 'pcs'];

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    itemWeightUnit: 'gm',
    netQuantityUnit: 'pcs',
    type: productTypes[0],
    subType: '', // Initialize subType field
    itemWeight: '',
    netQuantity: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Create FormData and append the weight with unit
    const form = new FormData();
    const itemWeightWithUnit = `${formData.itemWeight}${formData.itemWeightUnit}`;
    const netQuantityWithUnit = `${formData.netQuantity}${formData.netQuantityUnit}`;

    // Append data to FormData
    Object.keys(formData).forEach((key) => {
      if (key !== 'itemWeight' && key !== 'netQuantity') {
        form.append(key, formData[key]);
      }
    });

    form.append('itemWeight', itemWeightWithUnit); // Sending combined weight and unit
    form.append('netQuantity', netQuantityWithUnit); // Sending combined quantity and unit

    if (image) form.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/products/add',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      setShowPopup(true); // Show the success popup
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product.');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Close the popup
    setFormData({
      itemWeightUnit: 'g',
      netQuantityUnit: 'pcs',
      type: productTypes[0],
      subType: '',
      itemWeight: '',
      netQuantity: '',
    }); // Reset form data
    setImage(null); // Reset image
  };

  return (
    <div className="py-5">
      <div className="max-w-5xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Product</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="col-span-1">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
                  required={field.required}
                />
              )}
            </div>
          ))}

          {/* Type Dropdown */}
          <div className="col-span-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
              required
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* SubType Field */}
          <div className="col-span-1">
            <label htmlFor="subType" className="block text-sm font-medium text-gray-700 mb-1">
              SubType
            </label>
            <input
              id="subType"
              type="text"
              name="subType"
              placeholder="SubType (optional)"
              value={formData.subType || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
            />
          </div>

          {/* Item Weight with Units */}
          <div className="col-span-1 flex space-x-4">
            <div className="flex-grow">
              <label htmlFor="itemWeight" className="block text-sm font-medium text-gray-700 mb-1">
                Item Weight
              </label>
              <input
                id="itemWeight"
                type="number"
                name="itemWeight"
                placeholder="Item Weight"
                value={formData.itemWeight || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="itemWeightUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="itemWeightUnit"
                name="itemWeightUnit"
                value={formData.itemWeightUnit}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Net Quantity with Units */}
          <div className="col-span-1 flex space-x-4">
            <div className="flex-grow">
              <label htmlFor="netQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Net Quantity
              </label>
              <input
                id="netQuantity"
                type="number"
                name="netQuantity"
                placeholder="Net Quantity"
                value={formData.netQuantity || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="netQuantityUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="netQuantityUnit"
                name="netQuantityUnit"
                value={formData.netQuantityUnit}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Image */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md shadow-md transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-green-500">Product Added Successfully!</h2>
            <p className="mt-2 text-gray-700">Your product has been added successfully.</p>
            <button
              onClick={handlePopupClose}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;
