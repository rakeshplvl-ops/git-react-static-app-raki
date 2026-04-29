import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Task from "../components/Task";
import "../css/TasksDisplayPage.css";
import { useEffect, useState } from "react";
import { useSearch } from "../contexts/SearchContext";

function TasksDisplayPage() {
  const { filter } = useParams();
  const [Tasks, setTasks] = useState([]);
  const [DeleteTask, SetDeleteTask] = useState(null);
  const { searchQuery } = useSearch();

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/Tasks/DeleteTask/${DeleteTask.id}`);
      console.log("Task deleted successfully:", res.data);
      setTasks((prev) => prev.filter((t) => t.id !== DeleteTask.id));
      SetDeleteTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      SetDeleteTask(null);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/Tasks/GetTasks");

        let data = res.data;

        console.log("Fetched tasks:", data);

        data.sort((a, b) => a.taskNumber - b.taskNumber);

        if (filter === "completed") {
          data = data.filter((task) => task.taskStatus === false);
        }

        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [filter]);

  // Filter tasks based on search query
  const filteredTasks = Tasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.taskName?.toLowerCase().includes(query) ||
      task.shortDescription?.toLowerCase().includes(query) ||
      task.longDescription?.toLowerCase().includes(query)
    );
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="tasks-page-container">
        <div className="no-tasks-message">
          {searchQuery ? `No tasks matching "${searchQuery}"` : "No tasks available."}
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page-container">
      <div className="tasks-container">
        <div className="tasks-inner-container">
          {filteredTasks.map((item, index) => (
            <Link
              to={`/TaskDetail/${item.taskName}`}
              key={index}
              className="tasks-link"
            >
              <div className="item" key={index}>
                {
                  <Task
                    task={item}
                    number={index}
                    onDelete={() => SetDeleteTask(item)}
                  />
                }
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
