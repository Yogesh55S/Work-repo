import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import "../css/PersonalInformation.css"; // Import the updated CSS

const PersonalInformation = () => {
  const { token } = useAuth(); // Retrieve token from AuthContext
  const { userData } = useOutletContext() || {}; // Get user data passed from UserPanel
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [editableFields, setEditableFields] = useState({
    fullName: false,
    phone: false,
    email: false,
  });
  const [isModified, setIsModified] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL; // Fetch API_URL
  const navigate = useNavigate();

  // Populate formData with user data
  useEffect(() => {
    if (!token) {
      console.error("No token found in AuthContext.");
      navigate("/login");
      return;
    }

    if (userData) {
      const mappedData = {
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        email: userData.email || "",
      };
      setFormData(mappedData);
      setOriginalData(mappedData);
    }
  }, [userData, token, navigate]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const isAnyFieldModified = Object.keys(formData).some(
      (key) => value !== originalData[key]
    );
    setIsModified(isAnyFieldModified);
  };

  // Enable editing for a specific field
  const enableEditing = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  // Save changes to the backend
  const handleSaveChanges = () => {
    if (!token) {
      console.error("No token found. Cannot save changes.");
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update user profile");
        return response.json();
      })
      .then((updatedData) => {
        setOriginalData(updatedData);
        setIsModified(false);
        setEditableFields({
          fullName: false,
          phone: false,
          email: false,
        });
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };

  return (
    <div className="personal-info-container">
      <h2 className="title">Personal Information</h2>
      <p className="description">
        Update your personal details and contact information.
      </p>
      <form className="personal-info-form">
        {[
          { label: "Full Name", name: "fullName" },
          { label: "Phone Number", name: "phone" },
          { label: "Email ID", name: "email" },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <div className="field-wrapper">
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ""}
                disabled={!editableFields[field.name]}
                onChange={handleInputChange}
                className={`${
                  editableFields[field.name] ? "editable" : "disabled"
                }`}
              />
              <button
                type="button"
                className="edit-button"
                onClick={() => enableEditing(field.name)}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </form>
      {isModified && (
        <button onClick={handleSaveChanges} className="save-button">
          Save Changes
        </button>
      )}
    </div>
  );
};

export default PersonalInformation;
