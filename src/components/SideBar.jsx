import "../css/component-css/sideBar.css";
import { Link } from "react-router-dom";

function SideBar() {
  const options = [
    { name: "Home", link: "/" },
    { name: "Tasks", link: "/tasks" },
    { name: "Completed", link: `/tasks/completed` },
    { name: "Create Task", link: "/create-task" },
    { name: "Profile", link: "/profile" },
  ];
  return (
    <div className="side-bar">
      {options.map((option, index) => (
        <div key={index} className="side-bar-option">
          <Link className="side-bar-link" to={option.link}>
            <div className="link-text">{option.name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
