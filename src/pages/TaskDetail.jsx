import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "../css/component-css/Skeleton.css";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/Tasks/UpdateTask/${task.id}`, task);
      showToast("Task updated successfully!");
      navigate("/tasks");
    } catch (error) {
      showToast("Failed to update task", "error");
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Tasks/DeleteTask/${task.id}`);
      showToast("Task deleted successfully");
      navigate("/tasks");
    } catch (error) {
      showToast("Failed to delete task", "error");
      setError("Failed to delete task.");
      console.error("Error deleting task:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const loadTask = async () => {
      try {
        const res = await api.get(`/Tasks/GetTask/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error("Error loading task:", err);
        setError("Failed to load task.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTask();
  }, [id]);

  if (isLoading) {
    return (
      <div className="task-form-container">
        <div className="task-form-card">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text" style={{ height: "150px" }}></div>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="task-form-container">
        <div className="task-form-card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--accent-danger)" }}>⚠️ Connection Error</h2>
          <p>{error}</p>
          <button 
            className="task-form-btn task-form-btn-primary" 
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/tasks")}
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <h2>Edit Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="task-form-row">
            <div className="task-form-group">
              <label className="task-form-label">Title</label>
              <input
                type="text"
                value={task.taskName ?? ""}
                onChange={handleChange}
                name="taskName"
                placeholder="Enter task title"
                className="task-form-input title-input"
              />
            </div>

            <div className="task-form-date-wrapper">
              <label className="task-form-label">Start Date</label>
              <input
                type="date"
                value={task.startDate ?? ""}
                onChange={handleChange}
                name="startDate"
                className="task-form-date-input"
              />
            </div>

            <div className="task-form-date-wrapper">
              <label className="task-form-label">End Date</label>
              <input
                type="date"
                value={task.endDate ?? ""}
                onChange={handleChange}
                name="endDate"
                className="task-form-date-input"
              />
            </div>

            <label className="task-form-checkbox-wrapper">
              <input
                type="checkbox"
                onChange={(e) => {
                  setTask((prevTask) => ({
                    ...prevTask,
                    taskStatus: e.target.checked,
                  }));
                }}
                checked={task.taskStatus ?? false}
                name="taskStatus"
                className="task-form-checkbox"
              />
              <span className="task-form-checkbox-label">Active</span>
            </label>
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Short Description</label>
            <input
              type="text"
              placeholder="Brief summary of the task"
              className="task-form-input"
              value={task.shortDescription ?? ""}
              onChange={handleChange}
              name="shortDescription"
            />
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Long Description</label>
            <textarea
              placeholder="Detailed description of the task"
              className="task-form-textarea"
              value={task.longDescription ?? ""}
              onChange={handleChange}
              name="longDescription"
            />
          </div>



          <div className="task-form-actions">
            <button
              type="button"
              className="task-form-btn task-form-btn-danger"
              onClick={() => setShowDeleteModal(true)}
              style={{ marginRight: "auto" }}
            >
              Delete Task
            </button>
            <button
              type="button"
              className="task-form-btn task-form-btn-secondary"
              onClick={() => navigate("/tasks")}
            >
              Cancel
            </button>
            <button type="submit" className="task-form-btn task-form-btn-primary">
              Save Changes
            </button>
          </div>

          {error && <div className="task-form-error">{error}</div>}
        </form>
      </div>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{task.taskName}"?</p>
            <div className="yesorno">
              <button className="deleteOption" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="deleteOption"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetail;
