import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useSearch } from "../contexts/SearchContext";
import { useNavigate } from "react-router-dom";
import "../css/header.css";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoggedIn } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-wrapper")) {
        setShowNotification(false);
      }
    };

    if (showNotification) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotification]);

  return (
    <div className="header-container">
      <div className="header-inner-container">
        <h3 className="header-name" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Taskz</h3>
        <input
          type="text"
          disabled={!isLoggedIn}
          className="header-search"
          placeholder="search taskz"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="header-options">
          <div className="header-option notification-wrapper" onClick={handleNotificationClick}>
            🔔
            {showNotification && (
              <div className="notification-tooltip">
                No new notifications
              </div>
            )}
          </div>
          <div className="profile-icon header-option">
            <ProfileMenu />
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
