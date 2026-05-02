import { useNavigate } from "react-router-dom";
import "../css/ProfilePage.css";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState } from "react";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("server-offline", handleOffline);
    return () => window.removeEventListener("server-offline", handleOffline);
  }, []);

  function handleLogout() {
    logout();
    console.log("User logged out:", user);
    navigate("/login");
  }

  // If no user data
  if (!user) {
    return (
      <div className="profile-container" style={{ width: "100%" }}>
        <div className="profile-card">
          <h2>User not found</h2>
          <p>Please log in to view your profile.</p>
          <button className="logout-btn" onClick={handleLogout}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar">👤</div>

        <h2>{user.name}</h2>
        <p className="email">{user.email}</p>

        <div className="info">
          <p>
            <strong>Status:</strong> {isOffline ? <span style={{ color: "var(--accent-warning)" }}>⚠️ Offline (Cached)</span> : "Logged In"}
          </p>
        </div>

        <div className="Profile-actions">
          <button className="edit-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
