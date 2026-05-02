import { useState, useRef, useEffect } from "react";
import "../css/component-css/ProfileMenu.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    console.log("Logging out user");
    logout();
    setOpen(false);
    console.log("User logged out, redirecting to login page");
    navigate("/login");
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <div 
        onClick={() => setOpen(!open)} 
        style={{ cursor: "pointer", padding: "4px", fontSize: "1.2rem" }}
      >
        👤
      </div>

      {open && (
        <div className="dropdown">
          <p onClick={() => { navigate("/profile"); setOpen(false); }}>Profile</p>
          <p onClick={handleLogout}>{isLoggedIn ? "Logout" : "Login"}</p>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
