import "../css/component-css/sideBar.css";
import { NavLink } from "react-router-dom";

function SideBar() {
  const options = [
    { name: "Home", link: "/" },
    { name: "Tasks", link: "/tasks" },
    { name: "Pending", link: "/tasks/pending" },
    { name: "Completed", link: `/tasks/completed` },
    { name: "Create Task", link: "/create-task" },
    { name: "Profile", link: "/profile" },
  ];
  return (
    <div className="side-bar">
      {options.map((option, index) => (
        <div key={index} className="side-bar-option">
          <NavLink 
            className={({ isActive }) => `side-bar-link ${isActive ? "active" : ""}`} 
            to={option.link}
            // Ensure Home and Tasks don't highlight when on sub-pages
            end={option.link === "/" || option.link === "/tasks"}
          >
            <div className="link-text">{option.name}</div>
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
