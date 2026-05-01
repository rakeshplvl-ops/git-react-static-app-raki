import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/useAuth";
import { useSearch } from "../contexts/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/header.css";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { isLoggedIn } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const showSearch =
    location.pathname === "/tasks" || location.pathname === "/tasks/:filter";

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSidebarNav = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest(".hamburger-btn")) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSidebar]);

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
        <button className="hamburger-btn" onClick={(e) => { e.stopPropagation(); setShowSidebar(!showSidebar); }}>
          <span className={`hamburger-line ${showSidebar ? "open" : ""}`}></span>
          <span className={`hamburger-line ${showSidebar ? "open" : ""}`}></span>
          <span className={`hamburger-line ${showSidebar ? "open" : ""}`}></span>
        </button>
        <h3 className="header-name" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Taskz</h3>
        <input type="text" disabled={!showSearch || !isLoggedIn} className="header-search" placeholder="search taskz" value={searchQuery} onChange={handleSearchChange} />
        <div className="header-options">
          <div className="header-option notification-wrapper" onClick={handleNotificationClick}>
            🔔
            {showNotification && (<div className="notification-tooltip">No new notifications</div>)}
          </div>
          <div className="profile-icon header-option"><ProfileMenu /></div>
          <div className="header-option" onClick={() => navigate("/about")}>❓</div>
        </div>
      </div>

      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}
      <div className={`sidebar ${showSidebar ? "sidebar-open" : ""}`} ref={sidebarRef}>
        {isLoggedIn ? (
          <>
            <div className="sidebar-item" onClick={() => handleSidebarNav("/")}>🏠 Home</div>
            <div className="sidebar-item" onClick={() => handleSidebarNav("/tasks")}>📋 Tasks</div>
            <div className="sidebar-item" onClick={() => handleSidebarNav("/tasks/completed")}>✅ Completed</div>
            <div className="sidebar-item" onClick={() => handleSidebarNav("/create-task")}>➕ Create Task</div>
            <div className="sidebar-item" onClick={() => handleSidebarNav("/profile")}>👤 Profile</div>
          </>
        ) : null}
        <div className="sidebar-item" onClick={() => handleSidebarNav("/about")}>❓ About</div>
      </div>
    </div>
  );
}

export default Header;
