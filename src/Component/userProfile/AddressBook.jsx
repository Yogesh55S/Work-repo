import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthContext";
import "../css/AddressBook.css";

const AddressBook = () => {
  const { token, user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?._id) return;
    fetchAddresses();
  }, [token, user?._id]);

  const fetchAddresses = () => {
    fetch(`${API_URL}/addresses/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch((error) => console.error("Error fetching addresses:", error));
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/addresses/${user._id}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchAddresses())
      .catch((error) => console.error("Error deleting address:", error));
  };

  const handleSave = (formData) => {
    const method = formData._id ? "PUT" : "POST";
    const url = formData._id
      ? `${API_URL}/addresses/${user._id}/${formData._id}`
      : `${API_URL}/addresses/${user._id}`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        fetchAddresses();
        setShowModal(false);
        setSelectedAddress(null);
      })
      .catch((error) => console.error("Error saving address:", error));
  };

  const defaultAddress = addresses[0];
  const otherAddresses = addresses.slice(1);

  return (
    <div className="address-book-container">
      <h2 className="title">Saved Addresses</h2>

      <div className="button-para">
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. <br /> Sed
          faucibus morbi curae maecenas dignissim volutpat hac quam.
        </p>
        <button className="add-address-btn" onClick={() => handleEdit(null)}>
          + Add New Address
        </button>
      </div>

      <div className="address-section">
        {defaultAddress && (
          <div className="address-card-box default-address">
            <h3 className="address-section-title">Default Address</h3>
            <AddressDetails
              address={defaultAddress}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {otherAddresses.length > 0 && (
          <div>
            <h3 className="address-section-title">Other Addresses</h3>
            {otherAddresses.map((address) => (
              <AddressDetails
                key={address._id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddressModal
          address={selectedAddress}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const AddressDetails = ({ address, onEdit, onDelete }) => (
  <div className="address-card">
    <div className="address-details">
      <p className="address-title">
        {address.deliveryName} - <span className="address-tag">{address.tag}</span>
      </p>
      <p>
        {address.houseNumber}, {address.city}, {address.state} - {address.zip}
      </p>
      <p>
        <strong>Mobile:</strong> {address.deliveryNumber}
      </p>
    </div>
    <div className="address-actions">
      <button onClick={() => onEdit(address)} className="edit-btn">
        <i className="fas fa-pencil-alt"></i>
      </button>
      <button onClick={() => onDelete(address._id)} className="delete-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  </div>
);

const AddressModal = ({ address, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    deliveryName: address?.deliveryName || "",
    deliveryNumber: address?.deliveryNumber || "",
    houseNumber: address?.houseNumber || "",
    city: address?.city || "",
    state: address?.state || "",
    zip: address?.zip || "",
    tag: address?.tag || "home",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...formData, _id: address?._id });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title-container">
          <h3>Add New Address</h3>
        </div>

        <div className="form-section-shadow">
          <div className="form-group full-width">
            <label>Name *</label>
            <input
              type="text"
              name="deliveryName"
              value={formData.deliveryName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>Mobile Number *</label>
            <input
              type="text"
              name="deliveryNumber"
              value={formData.deliveryNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section-top-shadow">
          <div className="form-group full-width">
            <label>House Number *</label>
            <input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>ZIP *</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Tag *</label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="form-control"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            CANCEL
          </button>
          <button onClick={handleSubmit} className="save-btn">
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
