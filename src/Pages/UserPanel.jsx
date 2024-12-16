import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../Component/providers/AuthContext"; // Assuming useAuth is available
import "../Component/css/UserPanel.css"; // Import CSS for UserPanel

const UserPanel = () => {
  const { token, user, logout } = useAuth(); // Fetch user data and token from AuthContext
  const [userData, setUserData] = useState(user || null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      console.error("No token found in AuthContext.");
      return;
    }

    if (!userData) {
      // Fetch user data only if it's not already available in AuthContext
      fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              console.error("Token validation failed or token expired.");
              logout();
            }
            throw new Error("Failed to fetch user profile");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched User Data in UserPanel:", data);
          setUserData(data);
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [API_URL, token, userData, logout]);

  return (
    <div className="user-panel-container">
      <div className="user-panel">
        {/* Sidebar */}
        <div className="user-sidebar">
          <div className="user-profile">
            <div className="profile-image">
              <img
                src={userData?.profilePicture || "https://via.placeholder.com/150"} // Display user profile picture or placeholder
                alt="User Avatar"
                className="profile-img"
              />
            </div>
            <h2 className="sidebar-title">{userData?.fullName || "My Account"}</h2>
            <p className="sidebar-email">{userData?.email || "user@example.com"}</p>
          </div>
          <ul className="sidebar-links">
            {[
              { label: "Profile", path: "profile" },
              { label: "Address Book", path: "address-book" },
              { label: "Orders", path: "orders" },
              { label: "Payment", path: "payment" },
              { label: "Security", path: "security" },
              { label: "Help & Support", path: "help-support" },
            ].map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="sidebar-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="user-content">
          <Outlet context={{ userData }} /> {/* Pass user data to nested routes */}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
