import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../Component/providers/AuthContext";
import "../Component/css/UserPanel.css";

const UserPanel = () => {
  const { token, user, logout } = useAuth();
  const [userData, setUserData] = useState(user || null);
  const [activeLink, setActiveLink] = useState("profile"); // Track active sidebar link
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      console.error("No token found in AuthContext.");
      return;
    }

    if (!userData) {
      fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              logout();
            }
            throw new Error("Failed to fetch user profile");
          }
          return response.json();
        })
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [API_URL, token, userData, logout]);

  return (
    <div className="user-panel-container py-28">
      <div className="user-panel">
        <div className="user-sidebar">
          <div className="user-profile">
            <div className="account space-y-4"><p>My Account</p>
            <div className="profile-image">
              <img
                src={userData?.profilePicture || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="profile-img"
              />
            </div>
            </div>
            {/* <h2 className="sidebar-title">{userData?.fullName || "My Account"}</h2> */}
            {/* <p className="sidebar-email">{userData?.email || "user@example.com"}</p> */}
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
                  className={`sidebar-link ${activeLink === item.path ? "active" : ""}`}
                  onClick={() => setActiveLink(item.path)} // Set active link on click
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
