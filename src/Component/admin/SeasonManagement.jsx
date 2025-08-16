// src/Component/admin/SeasonManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlusCircle, FiPlus, FiX } from 'react-icons/fi';

const SeasonManagement = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSeasonData, setActiveSeasonData] = useState({
    season_name: '',
    collection_name: '',
    collection_description: '',
    banner_image_desktop: '',
    banner_image_mobile: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Season Product Management
  const [viewingSeason, setViewingSeason] = useState('');
  const [seasonProducts, setSeasonProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Season Creation
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false);
  const [newSeasonData, setNewSeasonData] = useState({
    season_name: '',
    collection_name: '',
    collection_description: '',
    banner_image_desktop: '',
    banner_image_mobile: ''
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSeasons();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (viewingSeason) {
      fetchSeasonProducts(viewingSeason);
    }
  }, [viewingSeason]);

  const fetchSeasons = async () => {
    try {
      const response = await axios.get(`${API_URL}/seasons`);
      setSeasons(response.data.seasons || []);
      
      const activeResponse = await axios.get(`${API_URL}/seasons/active`);
      if (activeResponse.data.season) {
        setActiveSeasonData(activeResponse.data.season);
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
      toast.error('Failed to fetch seasons');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSeasonProducts = async (seasonName) => {
    try {
      const response = await axios.get(`${API_URL}/products?season=${seasonName}`);
      setSeasonProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching season products:', error);
      toast.error('Failed to fetch season products');
    }
  };

  const handleSeasonDataUpdate = async () => {
    if (!activeSeasonData.season_name) {
      toast.error('No active season selected');
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('authToken');
      
      await axios.put(`${API_URL}/seasons/${activeSeasonData.season_name}`, {
        collection_name: activeSeasonData.collection_name,
        collection_description: activeSeasonData.collection_description,
        banner_image_desktop: activeSeasonData.banner_image_desktop,
        banner_image_mobile: activeSeasonData.banner_image_mobile
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Season data updated successfully');
      fetchSeasons();
    } catch (error) {
      console.error('Error updating season data:', error);
      toast.error('Failed to update season data');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetActiveSeason = async (seasonName) => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.put(`${API_URL}/seasons/${seasonName}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`${seasonName} is now the active season`);
      fetchSeasons();
    } catch (error) {
      console.error('Error setting active season:', error);
      toast.error('Failed to set active season');
    }
  };

  const handleRemoveFromSeason = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_URL}/products/${productId}`, {
        season: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSeasonProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product removed from season');
    } catch (error) {
      console.error('Error removing product from season:', error);
      toast.error('Failed to remove product');
    }
  };

  const handleAddToSeason = async (productIds) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const updatePromises = productIds.map(productId =>
        axios.put(`${API_URL}/products/${productId}`, {
          season: viewingSeason
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(updatePromises);
      
      toast.success(`${productIds.length} products added to ${viewingSeason}`);
      setShowAddProductModal(false);
      fetchSeasonProducts(viewingSeason);
    } catch (error) {
      console.error('Error adding products to season:', error);
      toast.error('Failed to add products');
    }
  };

  const handleCreateNewSeason = async () => {
    if (!newSeasonData.season_name || !newSeasonData.collection_name) {
      toast.error('Season name and collection name are required');
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('authToken');
      
      await axios.post(`${API_URL}/seasons`, newSeasonData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('New season created successfully!');
      setNewSeasonData({
        season_name: '',
        collection_name: '',
        collection_description: '',
        banner_image_desktop: '',
        banner_image_mobile: ''
      });
      setShowNewSeasonForm(false);
      fetchSeasons();
    } catch (error) {
      console.error('Error creating season:', error);
      toast.error(error.response?.data?.error || 'Failed to create season');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Season Management</h1>

      {/* 1. Active Season Configuration */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Active Season Configuration</h2>
        
        {/* Season Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {seasons.map(season => (
            <button
              key={season.id}
              onClick={() => handleSetActiveSeason(season.season_name)}
              className={`p-3 border rounded-lg text-sm font-medium ${
                season.is_active 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {season.season_name}
              {season.is_active && <span className="ml-2">✓</span>}
            </button>
          ))}
        </div>

        {/* Season Data Form */}
        {activeSeasonData.season_name && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                value={activeSeasonData.collection_name || ''}
                onChange={(e) => setActiveSeasonData(prev => ({
                  ...prev,
                  collection_name: e.target.value
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter collection name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Description
              </label>
              <textarea
                value={activeSeasonData.collection_description || ''}
                onChange={(e) => setActiveSeasonData(prev => ({
                  ...prev,
                  collection_description: e.target.value
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                placeholder="Enter collection description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desktop Banner URL
                </label>
                <input
                  type="url"
                  value={activeSeasonData.banner_image_desktop || ''}
                  onChange={(e) => setActiveSeasonData(prev => ({
                    ...prev,
                    banner_image_desktop: e.target.value
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter desktop banner image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Banner URL
                </label>
                <input
                  type="url"
                  value={activeSeasonData.banner_image_mobile || ''}
                  onChange={(e) => setActiveSeasonData(prev => ({
                    ...prev,
                    banner_image_mobile: e.target.value
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter mobile banner image URL"
                />
              </div>
            </div>

            <button
              onClick={handleSeasonDataUpdate}
              disabled={isUpdating}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Season Data'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Season Product Management */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Season Product Management</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={viewingSeason}
            onChange={(e) => setViewingSeason(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select Season to View Products</option>
            {seasons.map(season => (
              <option key={season.season_name} value={season.season_name}>
                {season.season_name}
              </option>
            ))}
          </select>

          {viewingSeason && (
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FiPlusCircle />
              Add Products to {viewingSeason}
            </button>
          )}
        </div>

        {/* Season Products Table */}
        {viewingSeason && (
          <div className="overflow-x-auto">
            <h3 className="text-md font-medium mb-4">
              {viewingSeason} Products ({seasonProducts.length})
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seasonProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img className="h-8 w-8 rounded object-cover" src={product.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.productName || product.product_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveFromSeason(product._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Remove from season"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {seasonProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No products found for {viewingSeason} season
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Create New Season */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create New Season Event</h2>
          <button
            onClick={() => setShowNewSeasonForm(!showNewSeasonForm)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            {showNewSeasonForm ? <FiX /> : <FiPlus />}
            {showNewSeasonForm ? 'Cancel' : 'New Season'}
          </button>
        </div>

        {showNewSeasonForm && (
          <div className="border-t pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season Name *
                </label>
                <input
                  type="text"
                  value={newSeasonData.season_name}
                  onChange={(e) => setNewSeasonData(prev => ({
                    ...prev,
                    season_name: e.target.value
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Autumn, Festive, Valentine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={newSeasonData.collection_name}
                  onChange={(e) => setNewSeasonData(prev => ({
                    ...prev,
                    collection_name: e.target.value
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Autumn Collection"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Description
              </label>
              <textarea
                value={newSeasonData.collection_description}
                onChange={(e) => setNewSeasonData(prev => ({
                  ...prev,
                  collection_description: e.target.value
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                placeholder="Describe this season collection..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desktop Banner URL
                </label>
                <input
                  type="url"
                  value={newSeasonData.banner_image_desktop}
                  onChange={(e) => setNewSeasonData(prev => ({
                    ...prev,
                    banner_image_desktop: e.target.value
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter desktop banner image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Banner URL
                </label>
                <input
                  type="url"
                  value={newSeasonData.banner_image_mobile}
                  onChange={(e) => setNewSeasonData(prev => ({
                    ...prev,
                    banner_image_mobile: e.target.value
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter mobile banner image URL"
                />
              </div>
            </div>

            <button
              onClick={handleCreateNewSeason}
              disabled={isUpdating || !newSeasonData.season_name || !newSeasonData.collection_name}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isUpdating ? 'Creating...' : 'Create Season'}
            </button>
          </div>
        )}
      </div>

      {/* Add Products Modal */}
      {showAddProductModal && (
        <ProductAddModal
          viewingSeason={viewingSeason}
          allProducts={allProducts}
          seasonProducts={seasonProducts}
          onClose={() => setShowAddProductModal(false)}
          onAdd={handleAddToSeason}
        />
      )}
    </div>
  );
};

// Helper Component for Adding Products
const ProductAddModal = ({ viewingSeason, allProducts, seasonProducts, onClose, onAdd }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  
  const seasonProductIds = seasonProducts.map(p => p._id);
  const availableProducts = allProducts.filter(p => !seasonProductIds.includes(p._id));

  const handleSelect = (productId) => {
    setSelectedIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAdd(selectedIds);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add Products to {viewingSeason}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {availableProducts.length > 0 ? (
            <div className="space-y-2">
              {availableProducts.map((product) => (
                <label key={product._id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product._id)}
                    onChange={() => handleSelect(product._id)}
                    className="h-4 w-4 text-blue-600 mr-3"
                  />
                  <div className="flex-shrink-0 h-8 w-8 mr-3">
                    <img className="h-8 w-8 rounded object-cover" src={product.image} alt="" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{product.productName || product.product_name}</div>
                    <div className="text-xs text-gray-500">₹{product.price}</div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              All products are already assigned to {viewingSeason}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Add {selectedIds.length} Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeasonManagement;