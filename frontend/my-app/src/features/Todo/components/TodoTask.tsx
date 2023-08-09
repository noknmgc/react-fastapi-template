import { useState, useEffect } from "react";
import { Task, User } from "../../../common/types";
import { deleteTask } from "../api/deleteTask";
import { updateTask } from "../api/updateTask";
import SecondaryButton from "../../../common/components/button/SecondaryButton";

interface TodoTaskProps {
  user: User;
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoTask: React.FC<TodoTaskProps> = ({ user, task, setTasks }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [done, setDone] = useState(task.done);

  useEffect(() => {
    updateTask(user.token, task, { done });
  }, [done, user.token, task]);

  const handleChangeEditMode = () => {
    setEditing((prev) => !prev);
  };

  const handleConfirmTitle = () => {
    updateTask(user.token, task, { title });
    setTasks((prev) => {
      return prev.map((t) => {
        if (t.id === task.id) {
          return { ...t, title: title };
        } else {
          return { ...t };
        }
      });
    });
    handleChangeEditMode();
  };

  const handleDeleteClick = async (task: Task) => {
    await deleteTask(user.token, task);
    setTasks((prev) => {
      return prev.filter((t) => t.id !== task.id);
    });
  };
  return (
    <>
      <input
        type="checkbox"
        checked={done}
        onChange={async (e) => {
          setDone((prev) => !prev);
        }}
      />
      {editing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onBlur={handleConfirmTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleConfirmTitle();
            }
          }}
          style={{ padding: "3px", marginLeft: "1.5rem", width: "100%" }}
        />
      ) : (
        <label
          style={{ marginLeft: "1.5rem", width: "100%" }}
          onClick={handleChangeEditMode}
        >
          {task.title}
        </label>
      )}

      <SecondaryButton
        onClick={() => {
          handleDeleteClick(task);
        }}
        style={{ marginLeft: "1.5rem" }}
      >
        x
      </SecondaryButton>
    </>
  );
};

export default TodoTask;
