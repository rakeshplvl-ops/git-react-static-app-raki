import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/useAuth";
import { useSearch } from "../contexts/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/header.css";
import ProfileMenu from "./ProfileMenu";
import { useToast } from "../contexts/ToastContext";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { isLoggedIn } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { history, clearHistory } = useToast();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const showSearch = location.pathname.startsWith("/tasks");

  const navigate = useNavigate();

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotification(!showNotification);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSidebarNav = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  // Combined click-outside logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Sidebar
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest(".hamburger-btn")) {
        setShowSidebar(false);
      }
      // Notifications
      if (showNotification && !e.target.closest(".notification-wrapper") && !e.target.closest(".header-mobile-notif")) {
        setShowNotification(false);
      }
      // Profile menu
      if (showMenu) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSidebar, showNotification, showMenu]);

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
        
        {/* 📱 Mobile Notification Bell */}
        <div className="header-mobile-notif notification-wrapper" onClick={handleNotificationClick}>
          🔔
          {history.length > 0 && <span className="notification-badge">{history.length}</span>}
          {showNotification && (
            <div className="notification-dropdown glass">
              <div className="notification-header">
                <span>Activity</span>
                {history.length > 0 && (
                  <button className="clear-all-btn" onClick={(e) => { e.stopPropagation(); clearHistory(); }}>Clear</button>
                )}
              </div>
              <div className="notification-list">
                {history.length === 0 ? (
                  <div className="empty-notifications">No activity</div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className={`notification-item ${item.type}`}>
                      <span className="notif-icon">{item.type === "success" ? "✅" : "❌"}</span>
                      <div className="notif-content">
                        <p className="notif-msg">{item.message}</p>
                        <span className="notif-time">{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-options">
          <div className="header-option notification-wrapper" onClick={handleNotificationClick}>
            🔔
            {history.length > 0 && <span className="notification-badge">{history.length}</span>}
            {showNotification && (
              <div className="notification-dropdown glass">
                <div className="notification-header">
                  <span>Recent Activity</span>
                  {history.length > 0 && (
                    <button className="clear-all-btn" onClick={(e) => { e.stopPropagation(); clearHistory(); }}>Clear</button>
                  )}
                </div>
                <div className="notification-list">
                  {history.length === 0 ? (
                    <div className="empty-notifications">No recent activity</div>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className={`notification-item ${item.type}`}>
                        <span className="notif-icon">{item.type === "success" ? "✅" : "❌"}</span>
                        <div className="notif-content">
                          <p className="notif-msg">{item.message}</p>
                          <span className="notif-time">{item.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
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
            <div className="sidebar-item" onClick={() => handleSidebarNav("/tasks/pending")}>⏳ Pending</div>
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
