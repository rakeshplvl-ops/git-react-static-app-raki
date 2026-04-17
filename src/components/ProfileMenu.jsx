import { useState } from "react";
import "../css/component-css/ProfileMenu.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const Logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    setOpen(false);
    setUser(null);
    setIsLoggedIn(false);
    console.log("User logged out, redirecting to login page");
    navigate("/login");
  };

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)}>👤</div>

      {open && (
        <div className="dropdown">
          <p onClick={() => navigate("/profile")}>Profile</p>
          <p onClick={Logout}>{isLoggedIn ? "Logout" : "Login"}</p>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
