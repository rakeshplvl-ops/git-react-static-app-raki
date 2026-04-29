import { useNavigate } from "react-router-dom";
import "../css/AboutPage.css";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-card">
        <button className="about-close-btn" onClick={() => navigate(-1)}>
          ✕
        </button>
        <h1>About</h1>

        <p>
          This Task Management app helps you organize your daily work, track
          progress, and stay productive.
        </p>

        <div className="about-section">
          <h3>✨ Features</h3>
          <ul>
            <li>Create, update, and delete tasks</li>
            <li>Mark tasks as completed</li>
            <li>Filter tasks based on status</li>
            <li>Secure authentication</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>🚀 Tech Stack</h3>
          <ul>
            <li>React (Frontend)</li>
            <li>.NET Web API (Backend)</li>
            <li>SQL Server</li>
          </ul>
        </div>

        <div className="about-footer">
          <p>Built for learning and productivity.</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
