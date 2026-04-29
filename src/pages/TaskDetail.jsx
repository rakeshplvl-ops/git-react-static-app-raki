import { useNavigate, useParams } from "react-router-dom";
import "../css/task-form.css";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
      console.log("Task updated successfully:", res.data);
      navigate("/tasks");
    } catch (error) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching task data for ID:", id);
    const loadTask = async () => {
      try {
        const res = await api.get(`/Tasks/GetTask/${id}`);
        setTask(res.data);
      } catch (error) {
        setError("Failed to load task. Please try again.");
        console.error("Error loading task:", error);
      }
    };

    loadTask();
  }, [id]);

  if (!task) {
    return <div className="task-form-container"><div className="task-form-card"><p style={{ color: '#94a3b8' }}>Loading...</p></div></div>;
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

          <div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              style={{ display: "none" }}
            />
            <label
              className="task-form-file-label"
              onClick={() => fileInputRef.current?.click()}
            >
              + Add Files
            </label>
          </div>

          <div className="task-form-actions">
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
    </div>
  );
}

export default TaskDetail;
