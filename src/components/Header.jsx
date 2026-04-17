import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import "../css/header.css";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();

  const HandleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
  };

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="header-container">
      <div className="header-inner-container">
        <h3 className="header-name">Taskz</h3>
        <input
          type="text"
          disabled={!isLoggedIn}
          className="header-search"
          placeholder="search taskz"
        />
        <div className="header-options">
          <div className="header-option">🔔</div>
          <div className="profile-icon header-option">
            <ProfileMenu handleLogout={HandleLogOut} />
          </div>
          <div className="header-option" onClick={() => navigate("/about")}>
            ❓
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
