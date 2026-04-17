import { useState } from "react";
import "../css/CreateTaskPage.css";
import { useNavigate } from "react-router-dom";

function CreateTaskPage() {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Task:", task);

    fetch("https://localhost:7176/api/Tasks/CreateTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(task),
    });
    setTask({
      title: "",
      shortDesc: "",
      longDesc: "",
      startDate: "",
      endDate: "",
      isActive: false,
      files: [],
    });
    navigate("/tasks");
  };

  return (
    <div className="create-task-container">
      <div className="form-card">
        <h2>Create Task</h2>

        <div className="row">
          <input
            type="text"
            value={task.taskName}
            onChange={handleChange}
            name="taskName"
            placeholder="taskName"
            className="input title"
          />

          <input
            type="date"
            value={task.startDate}
            onChange={handleChange}
            name="startDate"
            className="input"
          />
          <input
            type="date"
            value={task.endDate}
            onChange={handleChange}
            name="endDate"
            className="input"
          />

          <label className="checkbox">
            <input
              type="checkbox"
              onChange={handleChange}
              checked={task.taskStatus}
              name="taskStatus"
            />
            Active
          </label>
        </div>

        <input
          type="text"
          placeholder="Short Description"
          className="input full"
          value={task.shortDescription}
          onChange={handleChange}
          name="shortDescription"
        />

        <textarea
          placeholder="Long Description"
          className="textarea"
          value={task.longDescription}
          onChange={handleChange}
          name="longDescription"
        />

        <button onClick={handleFileChange} className="add-file">
          + Add Files
        </button>

        <div className="actions">
          <button onClick={handleSubmit} className="save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskPage;
