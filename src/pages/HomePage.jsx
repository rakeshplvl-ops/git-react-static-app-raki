import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="hometitle">Taskz</h1>
        <p className="subtitle">Organize your life. Stay productive.</p>

        <div className="homeactions">
          <div className="card" onClick={() => navigate("/create-task")}>
            ➕ Add Task
          </div>

          <div className="card" onClick={() => navigate("/tasks")}>
            📋 View Tasks
          </div>

          <div className="card" onClick={() => navigate("/about")}>
            ℹ️ About Taskz
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
