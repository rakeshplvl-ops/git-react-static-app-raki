import { useState, useRef } from "react";
import "../css/task-form.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";

function CreateTaskPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [task, setTask] = useState({
    taskName: "",
    shortDescription: "",
    longDescription: "",
    startDate: "",
    endDate: "",
    taskStatus: false,
    files: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setTask((prev) => ({
      ...prev,
      files: [...e.target.files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!task.taskName.trim()) {
      alert("Title is required");
      return;
    }

    try {
      await api.post("/Tasks/CreateTask", {
        taskName: task.taskName,
        shortDescription: task.shortDescription || "empty",
        longDescription: task.longDescription || "empty",
        startDate: task.startDate,
        endDate: task.endDate,
        taskStatus: task.taskStatus,
      });
      showToast("Task created successfully!");
      navigate("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      showToast("Failed to create task", "error");
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="task-form-row">
            <div className="task-form-group">
              <label className="task-form-label">Title</label>
              <input
                type="text"
                value={task.taskName}
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
                value={task.startDate}
                onChange={handleChange}
                name="startDate"
                className="task-form-date-input"
              />
            </div>

            <div className="task-form-date-wrapper">
              <label className="task-form-label">End Date</label>
              <input
                type="date"
                value={task.endDate}
                onChange={handleChange}
                name="endDate"
                className="task-form-date-input"
              />
            </div>

            <label className="task-form-checkbox-wrapper">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={task.taskStatus}
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
              value={task.shortDescription}
              onChange={handleChange}
              name="shortDescription"
            />
          </div>

          <div className="task-form-group" style={{ marginBottom: "16px" }}>
            <label className="task-form-label">Long Description</label>
            <textarea
              placeholder="Detailed description of the task"
              className="task-form-textarea"
              value={task.longDescription}
              onChange={handleChange}
              name="longDescription"
            />
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
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskPage;
