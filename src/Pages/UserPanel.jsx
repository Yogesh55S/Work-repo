import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Component/providers/AuthContext";
import "../Component/css/UserPanel.css";
import { fetchWithAuth } from "../utils/api"; // Import the utility function

const UserPanel = () => {
  const { token, user, logout } = useAuth();
  const [userData, setUserData] = useState(user || null);
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error("No token found in AuthContext.");
        return;
      }

      if (!userData) {
        try {
          const data = await fetchWithAuth(`${API_URL}/profile`, token);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user profile:", error.message);
          if (error.message.includes("Unauthorized")) {
            logout();
          }
        }
      }
    };

    fetchUserData();
  }, [API_URL, token, userData, logout]);

  return (
    <div className="user-panel-container py-28">
      <div className="user-panel">
        <div className="user-sidebar">
          <div className="user-profile">
            <div className="account space-y-4">
              <p>My Account</p>
              <div className="profile-image">
                <img
                  src={
                    userData?.profilePicture ||
                    "https://via.placeholder.com/150"
                  }
                  alt="User Avatar"
                  className="profile-img"
                />
              </div>
            </div>
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
                <Link
                  to={item.path}
                  className={`sidebar-link ${
                    location.pathname.includes(item.path) ? "active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="user-content">
          <Outlet context={{ userData }} />
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
