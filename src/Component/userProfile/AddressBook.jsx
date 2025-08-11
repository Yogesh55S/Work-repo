import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../providers/AuthContext';
import '../css/AddressBook.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faPencilAlt,
  faSpinner,
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
    if (!user?._id) return;
    fetchAddresses();
  }, [token, user?._id]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/addresses/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // Show delete confirmation instead of deleting directly
  const confirmDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, id: null });
  };

  // Actually delete the address after confirmation
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/addresses/${user._id}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      // Update the addresses state directly instead of refetching
      const updatedAddresses = addresses.filter(
        (address) => address._id !== id
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
    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id
      ? `${API_URL}/addresses/${user._id}/${formData._id}`
      : `${API_URL}/addresses/${user._id}`;

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
        throw new Error(errorData.message || 'Failed to save address');
      }

      // Instead of refetching, update the state directly
      const responseData = await response.json();

      if (method === 'POST') {
        // Add new address
        setAddresses([...addresses, responseData.address]);
      } else {
        // Update existing address
        setAddresses(
          addresses.map((addr) =>
            addr._id === formData._id ? { ...addr, ...formData } : addr
          )
        );
      }

      setShowModal(false);
      setSelectedAddress(null);

      // Success will be shown by the form component
    } catch (error) {
      console.error('Error saving address:', error);
      throw error; // Re-throw so the form can handle it
    }
  };

  if (loading) {
    return <AddressBookSkeleton />;
  }

  const defaultAddress = addresses[0]; // Assume the first address as default
  const otherAddresses = addresses.slice(1);

  return (
    <div className='address-book-container'>
      <h2 className='title'>Saved Addresses</h2>

      <div className='button-para'>
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit.Sed faucibus morbi
          curae maecenas dignissim volutpat hac quam.
        </p>
        <button
          className='brown-deep-button mt-5'
          onClick={() => handleEdit(null)}
        >
          + Add New Address
        </button>
      </div>

      <div className='address-section'>
        {defaultAddress && (
          <div className='address-card-box default-address'>
            <h3 className='address-section-title'>Default Address</h3>
            <AddressDetails
              address={defaultAddress}
              onEdit={handleEdit}
              onDelete={confirmDelete}
            />
          </div>
        )}

        {otherAddresses.length > 0 && (
          <div>
            <h3 className='address-section-title'>Other Addresses</h3>
            {otherAddresses.map((address) => (
              <AddressDetails
                key={address._id}
                address={address}
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddressForm
          initialData={selectedAddress}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.show && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h3 className='text-xl font-semibold text-[#6b4226] mb-4'>
              Delete Address
            </h3>
            <p className='text-gray-700 mb-6'>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={cancelDelete}
                className='py-2 px-4 text-gray-600 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none'
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation.id)}
                className='py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center'
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for displaying a single address card
const AddressDetails = ({ address, onEdit, onDelete }) => (
  <div className='address-card'>
    <div className='address-details'>
      <p className='address-title'>
        {address.deliveryName} -{' '}
        <span className='address-tag'>{address.tag}</span>
      </p>
      <p>
        {address.streetAddress}, {address.city}, {address.state} - {address.zip}
      </p>
      <p>
        <strong>Mobile:</strong> {address.deliveryNumber}
      </p>
    </div>
    <div className='address-actions'>
      <button onClick={() => onEdit(address)} className='edit-btn'>
        <FontAwesomeIcon icon={faPencilAlt} />
      </button>
      <button onClick={() => onDelete(address._id)} className='delete-btn'>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  </div>
);

// Add PropTypes validation for the AddressDetails component
AddressDetails.propTypes = {
  address: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    deliveryName: PropTypes.string.isRequired,
    deliveryNumber: PropTypes.string.isRequired,
    streetAddress: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AddressBook;