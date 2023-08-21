import { useState, useEffect } from "react";
import { Task, User } from "../../../common/types";
import { deleteTask } from "../api/deleteTask";
import { updateTask } from "../api/updateTask";
import SecondaryButton from "../../../common/components/button/SecondaryButton";
import EditableTextInput from "../../../common/components/input/EditableTextInput";

interface TodoTaskProps {
  user: User;
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoTask: React.FC<TodoTaskProps> = ({ user, task, setTasks }) => {
  const [title, setTitle] = useState(task.title);
  const [done, setDone] = useState(task.done);

  useEffect(() => {
    console.log("use effect", task.id);
    updateTask(user.token, task, { done });
  }, [done]);

  const handleConfirmTitle = () => {
    updateTask(user.token, task, { title });
    setTasks((prev) => {
      return prev.map((t) => {
        if (t.id === task.id) {
          return { ...t, title };
        } else {
          return { ...t };
        }
      });
    });
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
      <EditableTextInput
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        onBlur={(e) => {
          handleConfirmTitle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleConfirmTitle();
          }
        }}
        style={{ marginLeft: "1.5rem" }}
      />
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
