import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import "../css/PersonalInformation.css";
import leftArrow from "../../assets/svg/leftarrow.svg"; // Assuming SVG file is in assets

const PersonalInformation = () => {
  const { token } = useAuth();
  const { userData } = useOutletContext() || {};
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [editableFields, setEditableFields] = useState({
    fullName: false,
    phone: false,
    email: false,
  });
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
    }
  }, [userData, token, navigate]);

  const enableEditing = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="personal-info-container">
      <div className="section-header">

        <h2 className="personal">Personal Information</h2>  <img src={leftArrow} alt="Left Arrow" className="left-arrow" />
      </div>
      <p className="description">
      Lorem ipsum odor amet, consectetuer adipiscing elit. Sed faucibus morbi curae maecenas dignissim volutpat hac quam.
      </p>

      <form className="personal-info-form">
        {/* Full Name */}
        <div className="form-group full-name">
          <label>Full Name</label>
          <div className="field-wrapper">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              disabled={!editableFields.fullName}
              onChange={handleInputChange}
              className={`${
                editableFields.fullName ? "editable" : "disabled"
              }`}
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

        {/* Contact Information */}
        <div className="section-header">
       
         
          <h2 className="contact">Contact Information</h2> <img src={leftArrow} alt="Left Arrow" className="left-arrow" />
          
        </div>
        <p className="description">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Sed faucibus morbi curae maecenas dignissim volutpat hac quam.
      </p>
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
                className={`${
                  editableFields.phone ? "editable" : "disabled"
                }`}
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
                className={`${
                  editableFields.email ? "editable" : "disabled"
                }`}
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
    </div>
  );
};

export default PersonalInformation;
