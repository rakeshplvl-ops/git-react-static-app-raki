import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../css/component-css/TaskDetail.css";
import { useEffect, useState } from "react";

function TaskDetail() {
  const { id } = useParams();
  const [task, SetTask] = useState(null);
  const [error, SetError] = useState(null);
  const navigate = useNavigate();

  const updateData = (e) => {
    const { name, value } = e.target;
    SetTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const SubmitData = (e) => {
    e.preventDefault();
    fetch(`https://localhost:7176/api/Tasks/UpdateTask/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (!response.ok) {
          SetError("Failed to update task. Please try again.");
          console.log("Network response was not ok");
          return null;
        }
        const data = response.json();
        console.log("Task updated successfully:", data);
        return response.json();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
    navigate("/tasks");
  };

  useEffect(() => {
    console.log("Fetching task data for ID:", id);
    const loadTask = async () => {
      const response = await fetch(
        `https://localhost:7176/api/Tasks/GetTask/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      const text = await response.text();

      if (!response.ok) {
        SetError("Failed to load task. Please try again.");
        console.log("Network response was not ok");
        return;
      }

      const data = JSON.parse(text); // ✅ actual object
      SetTask(data); // ✅ correct
    };

    loadTask();
  }, [id]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="task-detail-outer-container">
      <div className="task-detail-inner-container">
        <div className="title-date-container">
          <label htmlFor="task-title" className="task-title-label">
            Title
          </label>
          <div className="date-entry">
            <div className="date-container">
              <label htmlFor="startDate" className="start-date">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="start-date-input input-text"
                onChange={updateData}
                value={task.startDate ?? ""}
              />
            </div>
            <div className="date-container">
              <label htmlFor="endDate" className="end-date">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="end-date-input input-text"
                onChange={updateData}
                value={task.endDate ?? ""}
              />
            </div>
          </div>
        </div>
        <div className="title-activeStatus-contianer">
          <input
            type="text"
            id="task-title"
            className="task-title-input input-text"
            name="taskName"
            onChange={updateData}
            value={task.taskName ?? ""}
          />
          <div className="active-status-toggler">
            <label htmlFor="activeStatus" className="active-status-label">
              Active
            </label>
            <input
              type="checkbox"
              id="activeStatus"
              name="status"
              className="active-status-input input-text"
              onChange={(e) => {
                SetTask((prevTask) => ({
                  ...prevTask,
                  taskStatus: e.target.checked,
                }));
              }}
              checked={task.taskStatus ?? false}
            />
          </div>
        </div>
        <label htmlFor="shortDescription" className="short-description-label">
          Short Description
        </label>
        <input
          type="text"
          id="shortDescription"
          className="short-description-input input-text"
          name="shortDescription"
          onChange={updateData}
          value={task.shortDescription ?? ""}
        />
        <label htmlFor="longDescription" className="long-description-label">
          Long Description
        </label>
        <textarea
          id="longDescription"
          cols="30"
          rows="5"
          name="longDescription"
          onChange={updateData}
          className="long-description-input input-text"
          value={task.longDescription ?? ""}
        />
        <div className="add-files">
          <label htmlFor="fileUpload" className="add-files-label">
            + Add Files
          </label>
          <input
            type="file"
            hidden
            id="fileUpload"
            className="add-files-input input-text"
          />
        </div>
      </div>
      <div className="savebtn">
        <button className="savebtn-button" onClick={SubmitData}>
          Save
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default TaskDetail;
