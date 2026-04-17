import "../css/component-css/Task.css";

function Task({ task, number, onDelete }) {
  return (
    <div className="task">
      <div className="tasknum-date-container">
        <div>{number + 1}</div>
        <div>{task.endDate}</div>
      </div>
      <div className="actions-container">
        <div>{task.taskName}</div>
        <div className="actions">
          <div
            className="delete action"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(task);
            }}
          >
            Delete
          </div>
        </div>
      </div>
      <div className="description-container">{task.shortDescription}</div>
    </div>
  );
}

export default Task;
