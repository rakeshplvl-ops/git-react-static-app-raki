import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/useAuth";
import "../css/HomePage.css";
import "../css/component-css/Skeleton.css";
import { useToast } from "../contexts/ToastContext";

function HomePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [quickTask, setQuickTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/Tasks/GetTasks");
        const data = res.data;
        setStats({
          total: data.length,
          pending: data.filter(t => t.taskStatus !== false).length,
          completed: data.filter(t => t.taskStatus === false).length,
        });
        setRecentTasks(data.slice(-3).reverse());
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleQuickTask = async (e) => {
    if (e.key !== "Enter" || !quickTask.trim() || isSubmitting) return;

    if (quickTask.trim().length < 8) {
      return showToast("Task title must be at least 8 characters.", "error");
    }

    setIsSubmitting(true);
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const taskData = {
        taskName: quickTask,
        shortDescription: "empty",
        longDescription: "empty",
        startDate: today.toISOString().split("T")[0],
        endDate: tomorrow.toISOString().split("T")[0],
        taskStatus: true,
      };

      await api.post("/Tasks/CreateTask", taskData);
      setQuickTask("");
      showToast("Task added successfully!");
      const res = await api.get("/Tasks/GetTasks");
      const data = res.data;
      setStats({
        total: data.length,
        pending: data.filter(t => t.taskStatus !== false).length,
        completed: data.filter(t => t.taskStatus === false).length,
      });
      setRecentTasks(data.slice(-3).reverse());
    } catch (err) {
      if (err.response) {
        console.error("Validation Errors:", err.response.data.errors);
      }
      console.error("Quick task creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="home-container fade-in guest-home">
        <section className="hero">
          <div className="hero-badge">Next-Gen Task Management</div>
          <h1 className="hometitle">Master your day with <span className="highlight">Taskz</span></h1>
          <p className="subtitle">
            The minimal, lightning-fast workspace for your daily goals. Organize, track, and crush your tasks with ease.
          </p>
          
          <div className="hero-actions">
            <button className="primary-hero-btn" onClick={() => navigate("/login")}>
              Get Started for Free
            </button>
            <button className="secondary-hero-btn" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
        </section>

        <div className="preview-grid">
           <div className="preview-card glass">
              <h3>⚡ Speed</h3>
              <p>Add tasks in seconds with our quick-entry system.</p>
           </div>
           <div className="preview-card glass">
              <h3>🛡️ Secure</h3>
              <p>Your data is protected with industry-standard security.</p>
           </div>
           <div className="preview-card glass">
              <h3>📱 Fluid</h3>
              <p>Work seamlessly across desktop and mobile devices.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container fade-in">
      <section className="hero">
        <h1 className="hometitle">Welcome back, <span className="highlight">{user?.username || "Raki"}</span></h1>
        <p className="subtitle">
          {stats.pending > 0
            ? `You have ${stats.pending} tasks to tackle today. Ready to crush them?`
            : "All caught up! Why not plan your next big thing?"}
        </p>

        <div className="quick-entry-container">
          <input
            type="text"
            className="quick-entry-input glass"
            placeholder="What needs to be done? (Press Enter)"
            value={quickTask}
            onChange={(e) => setQuickTask(e.target.value)}
            onKeyDown={handleQuickTask}
            disabled={isSubmitting}
          />
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="stats-panel">
          {isLoading ? (
            <>
              <div className="skeleton skeleton-stat"></div>
              <div className="skeleton skeleton-stat"></div>
            </>
          ) : (
            <>
              <div 
                className="stat-card glass clickable-card" 
                onClick={() => navigate("/tasks")}
              >
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div 
                className="stat-card glass clickable-card"
                onClick={() => navigate("/tasks/pending")}
              >
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
            </>
          )}
        </div>

        <div className="recent-tasks-panel glass">
          <h3>Recent Tasks</h3>
          <div className="recent-list">
            {isLoading ? (
              <>
                <div className="skeleton skeleton-text" style={{ height: "60px" }}></div>
                <div className="skeleton skeleton-text" style={{ height: "60px" }}></div>
                <div className="skeleton skeleton-text" style={{ height: "60px" }}></div>
              </>
            ) : recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="recent-item"
                  onClick={() => navigate(`/tasks/detail/${task.id}`)}
                >
                  <span className="recent-dot"></span>
                  <span className="recent-name">{task.taskName}</span>
                  <span className="recent-date">{task.startDate}</span>
                </div>
              ))
            ) : (
              <div className="empty-dashboard-state">
                <p className="empty-text">No tasks yet. Ready to start?</p>
                <button 
                  className="create-first-btn"
                  onClick={() => navigate("/create-task")}
                >
                  Create Your First Task
                </button>
              </div>
            )}
          </div>
          {!isLoading && recentTasks.length > 0 && (
            <button
              className="view-all-btn"
              onClick={() => navigate("/tasks")}
            >
              View All Board →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
