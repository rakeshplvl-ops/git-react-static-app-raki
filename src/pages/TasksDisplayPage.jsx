import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Task from "../components/Task";
import "../css/TasksDisplayPage.css";
import { useEffect, useState } from "react";
import { useSearch } from "../contexts/SearchContext";
import { useToast } from "../contexts/ToastContext";
import "../css/component-css/Skeleton.css";

function TasksDisplayPage() {
  const { filter } = useParams();
  const [Tasks, setTasks] = useState([]);
  const [DeleteTask, SetDeleteTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery } = useSearch();
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/Tasks/DeleteTask/${DeleteTask.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== DeleteTask.id));
      SetDeleteTask(null);
      showToast("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      SetDeleteTask(null);
      showToast("Failed to delete task", "error");
    }
  };

  const handleStatusChange = async (task) => {
    try {
      const newStatus = !task.taskStatus;

      // 1. Instantly update backend
      await api.put(`/Tasks/UpdateTask/${task.id}`, {
        ...task,
        taskStatus: newStatus,
      });

      // 2. Visually "mark" it as changed in the UI first
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, taskStatus: newStatus, isTransitioning: true } : t))
      );

      showToast(`Task ${task.taskName} marked as ${newStatus ? "Active" : "Completed"}`);

      // 3. Wait for the user to "see" the change, then let it exit the filter
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, isTransitioning: false } : t))
        );
      }, 1000);

    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/Tasks/GetTasks");
        let data = res.data;
        data.sort((a, b) => a.taskNumber - b.taskNumber);

        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
    // 🧹 Reset search when switching filters (Pending/Completed)
    return () => setSearchQuery("");
  }, [filter, setSearchQuery]); // 👈 Added filter dependency to trigger on navigation

  // Filter tasks based on URL filter AND search query
  const filteredTasks = Tasks.filter((task) => {
    // 1. URL Filter (Pending/Completed)
    // If it's transitioning, KEEP it visible so the user can see the change
    if (task.isTransitioning) return true;

    if (filter === "completed" && task.taskStatus !== false) return false;
    if (filter === "pending" && task.taskStatus === false) return false;

    // 2. Search Query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.taskName?.toLowerCase().includes(query) ||
      task.shortDescription?.toLowerCase().includes(query) ||
      task.longDescription?.toLowerCase().includes(query)
    );
  });

  // No tasks matching search or empty list
  if (!isLoading && filteredTasks.length === 0) {
    return (
      <div className="tasks-page-container">
        <div className="no-tasks-message">
          {searchQuery
            ? `No tasks matching "${searchQuery}"`
            : "No tasks available."}
        </div>
      </div>
    );
  }

  //Loading indicator

  return (
    <div className="tasks-page-container">
      <div className="tasks-container">
        <div className="tasks-inner-container">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton skeleton-card"></div>
            ))
          ) : (
            filteredTasks.map((item, index) => (
              <Link
                to={`/tasks/detail/${item.id}`}
                key={item.id}
                className="tasks-link"
              >
                <div className="item">
                  <Task
                    task={item}
                    number={index}
                    isTransitioning={item.isTransitioning}
                    onDelete={() => SetDeleteTask(item)}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </Link>
            ))
          )}
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
