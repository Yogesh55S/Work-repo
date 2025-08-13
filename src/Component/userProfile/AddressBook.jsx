import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faPencilAlt,
  faSpinner,
  faPlus,
  faHome,
  faBuilding,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import AddressBookSkeleton from '../skeletons/AddressBookSkeleton';
import AddressForm from '../AddressForm';
import { toast } from 'react-toastify';

const AddressBook = () => {
  const { token, user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.id) return;
    fetchAddresses();
  }, [token, user?.id]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, id: null });
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      const updatedAddresses = addresses.filter(
        (address) => address._id !== id && address.id !== id
      );
      setAddresses(updatedAddresses);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  const handleSave = async (formData) => {
    const method = formData._id || formData.id ? 'PUT' : 'POST';
    const addressId = formData._id || formData.id;
    const url = method === 'PUT' 
      ? `${API_URL}/addresses/${addressId}`
      : `${API_URL}/addresses`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save address');
      }

      const responseData = await response.json();
      if (method === 'POST') {
        setAddresses([...addresses, responseData.address]);
        toast.success('Address added successfully');
      } else {
        setAddresses(
          addresses.map((addr) =>
            (addr._id === addressId || addr.id === addressId) 
              ? { ...addr, ...responseData.address } 
              : addr
          )
        );
        toast.success('Address updated successfully');
      }

      setShowModal(false);
      setSelectedAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  };

  const getTagIcon = (tag) => {
    switch (tag.toLowerCase()) {
      case 'home':
        return faHome;
      case 'office':
      case 'work':
        return faBuilding;
      default:
        return faMapMarkerAlt;
    }
  };

  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case 'home':
        return 'bg-blue-500';
      case 'office':
      case 'work':
        return 'bg-gray-600';
      default:
        return 'bg-green-500';
    }
  };

  if (loading) {
    return <AddressBookSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Address Book</h2>
          <p className="text-gray-600 text-sm">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Sed faucibus morbi curae maecenas dignissim volutpat hac quam.
          </p>
        </div>
        
        <button
          onClick={() => {
            setSelectedAddress(null);
            setShowModal(true);
          }}
          className="bg-amber-800 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
          Add New Address
        </button>
      </div>

      {/* Addresses */}
      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-500 mb-6">Add your first address to get started</p>
          <button
            onClick={() => {
              setSelectedAddress(null);
              setShowModal(true);
            }}
            className="bg-amber-800 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div 
              key={address._id || address.id} 
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-amber-200 transition-all duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTagColor(address.tag)} text-white`}>
                    <FontAwesomeIcon 
                      icon={getTagIcon(address.tag)} 
                      className="text-sm"
                    />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTagColor(address.tag)}`}>
                    {address.tag}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                    title="Edit Address"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="text-sm" />
                  </button>
                  <button
                    onClick={() => confirmDelete(address._id || address.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Address"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {address.deliveryName}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {address.streetAddress}
                </p>
                <p className="text-gray-600 text-sm">
                  {address.city}, {address.state} {address.zip}
                </p>
                
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-medium">
                    {address.deliveryNumber}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showModal && (
        <AddressForm
          address={selectedAddress}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setSelectedAddress(null);
          }}
          onClose={() => {
            setShowModal(false);
            setSelectedAddress(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faTrash} className="text-2xl text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Address</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmation.id)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
