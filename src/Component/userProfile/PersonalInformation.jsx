import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import "../css/PersonalInformation.css";
import leftArrow from "../../assets/svg/leftarrow.svg";

const PersonalInformation = () => {
  const { token } = useAuth();
  const { userData } = useOutletContext() || {};
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
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("No token found in AuthContext.");
      navigate("/login");
    }
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        email: userData.email || "",
      });
      setOriginalData({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        email: userData.email || "",
      });
    }
  }, [userData, token, navigate]);

  const enableEditing = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsModified(true);
  };

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
        setFormData(updatedData); // Ensure frontend reflects updated data
        setIsModified(false);
        setEditableFields({
          fullName: false,
          phone: false,
          email: false,
        });
        alert("Changes saved successfully!");
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };

  return (
    <div className="personal-info-container">
      <div className="section-header">
        <h2 className="personal">Personal Information</h2>
        <img src={leftArrow} alt="Left Arrow" className="left-arrow" />
      </div>
      <p className="description">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Sed faucibus morbi
        curae maecenas dignissim volutpat hac quam.
      </p>

      <form className="personal-info-form">
        <div className="form-group full-name">
          <label>Full Name</label>
          <div className="field-wrapper">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              disabled={!editableFields.fullName}
              onChange={handleInputChange}
              className={`${editableFields.fullName ? "editable" : "disabled"}`}
            />
            <button
              type="button"
              className="edit-button"
              onClick={() => enableEditing("fullName")}
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
        </div>

        <div className="section-header">
          <h2 className="contact">Contact Information</h2>
          <img src={leftArrow} alt="Left Arrow" className="left-arrow" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <div className="field-wrapper">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                disabled={!editableFields.phone}
                onChange={handleInputChange}
                className={`${editableFields.phone ? "editable" : "disabled"}`}
              />
              <button
                type="button"
                className="edit-button"
                onClick={() => enableEditing("phone")}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Email ID</label>
            <div className="field-wrapper">
              <input
                type="text"
                name="email"
                value={formData.email}
                disabled={!editableFields.email}
                onChange={handleInputChange}
                className={`${editableFields.email ? "editable" : "disabled"}`}
              />
              <button
                type="button"
                className="edit-button"
                onClick={() => enableEditing("email")}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          </div>
        </div>
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
