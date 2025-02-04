import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import "../../css/Security.css";

const Security = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("No token found in AuthContext.");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data = await response.json();
        console.log("Fetched data from backend:", data);

        const user = data.user || {};
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
        });

        setIsGoogleUser(!!user.googleId);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const requestOtp = async () => {
    try {
      await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: formData.email }),
      });
      setOtpSent(true);
      alert("OTP sent to your email.");
    } catch (error) {
      alert("Error sending OTP: " + error.message);
    }
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (!otpSent) {
      requestOtp();
      return;
    }

    if (!otp) {
      alert("Please enter the OTP sent to your email.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
          newPassword,
        }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      alert("Password updated successfully.");
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-lg px-6 security-container">
      <div className="section-header">
        <h2 className="personal">Security Settings</h2>
      </div>
      {isGoogleUser ? (
        <div className="text-gray-700">
          <p>You signed in using Google. Manage your account through Google settings.</p>
        </div>
      ) : (
        <form className="space-y-6">
          <div className="form-group">
            <label className="font-semibold">Email ID</label>
            <input
              type="text"
              name="email"
              value={formData.email || ""}
              disabled
              className="disabled"
            />
          </div>

          {/* Old Password Field */}
          <div className="form-group">
            <label className="font-semibold">Old Password</label>
            <div className="field-wrapper">
              <input
                type={showPassword.oldPassword ? "text" : "password"}
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="input-style"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => togglePasswordVisibility("oldPassword")}
              >
                <FontAwesomeIcon icon={showPassword.oldPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="form-group">
            <label className="font-semibold">New Password</label>
            <div className="field-wrapper">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-style"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                <FontAwesomeIcon icon={showPassword.newPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div className="form-group">
            <label className="font-semibold">Confirm New Password</label>
            <div className="field-wrapper">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-style"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                <FontAwesomeIcon icon={showPassword.confirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* OTP Field */}
          {otpSent && (
            <div className="form-group">
              <label className="font-semibold">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="input-style"
              />
            </div>
          )}

          <button type="button" onClick={handleSaveChanges} className="brown-deep-button">
            {otpSent ? "UPDATE PASSWORD" : "SEND OTP"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Security;
