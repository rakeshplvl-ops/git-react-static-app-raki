import { Link, useNavigate, useParams } from "react-router-dom";
import Task from "../components/Task";
import "../css/TasksDisplayPage.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";

function TasksDisplayPage() {
  const { filter } = useParams();
  const [Tasks, SetTasks] = useState([]);
  const [DeleteTask, SetDeleteTask] = useState(null);
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(`https://localhost:7176/api/Tasks/DeleteTask/${DeleteTask.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
          SetDeleteTask(null);
          return null;
        }
        console.log("Task deleted successfully:", text);
        SetTasks((prev) => prev.filter((t) => t.id !== DeleteTask.id));
        SetDeleteTask(null);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  useEffect(() => {
    const fetchTasks = () => {
      fetch("https://localhost:7176/api/Tasks/GetTasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            SetTasks(null);
            if (response.status === 401) {
              alert("Session expired. Please log in again.");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("isLoggedIn");
              setIsLoggedIn(false);
              setUser(null);
              navigate("/login");
            }
            return null;
          } else {
            let data = await response.json();
            console.log("Fetched tasks:", data);
            data.sort((a, b) => a.taskNumber - b.taskNumber);

            if (filter === "completed") {
              data = data.filter((task) => task.taskStatus === false);
            }

            SetTasks(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    };
    fetchTasks();
  }, [filter, setIsLoggedIn, setUser, navigate]);

  if (Tasks == null || Tasks.length === 0) {
    return (
      <div className="tasks-page-container">
        <div className="no-tasks-message">No tasks available.</div>
      </div>
    );
  }

  return (
    <div className="tasks-page-container">
      <div className="tasks-container">
        <div className="tasks-inner-container">
          {Tasks.map((item, index) => (
            <Link
              to={`/TaskDetail/${item.taskName}`}
              key={index}
              className="tasks-link"
            >
              <div className="item" key={index}>
                {<Task task={item} number = {index} onDelete={() => SetDeleteTask(item)} />}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {DeleteTask && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete {DeleteTask.taskName}?</p>

            <div className="yesorno">
              <button className="deleteOption" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="deleteOption"
                onClick={() => SetDeleteTask(null)}
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

export default TasksDisplayPage;
