import { useNavigate } from "react-router-dom";
import "../css/ProfilePage.css";
import { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, setIsLoggedIn } = useAuth();

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsLoggedIn(false);
    console.log(" asdadasda" + localStorage.getItem("userData"));
    navigate("/login");
  }

  useEffect(() => {
    // If no user data
    console.log(" ssssssss " + localStorage.getItem("userData"));

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
  });

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar">👤</div>

        <h2>{user.name}</h2>
        <p className="email">{user.email}</p>

        <div className="info">
          <p>
            <strong>Status:</strong> Logged In
          </p>
        </div>

        <div className="Profile-actions">
          <button className="edit-btn">Edit Profile</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
