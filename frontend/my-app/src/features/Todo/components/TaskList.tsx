import { useState } from "react";

import PrimaryButton from "../../../common/components/button/PrimaryButton";
import TextInput from "../../../common/components/input/TextInput";
import { Task, User } from "../../../common/types";
import { createTask } from "../api/createTask";
import TodoTask from "./TodoTask";

interface TaskListProps {
  user: User;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<TaskListProps> = ({ user, tasks, setTasks }) => {
  const [title, setTitle] = useState("");

  const handleAddClick = async () => {
    const newTask = await createTask(user.token, title);
    setTasks((prev) => {
      return [...prev, newTask];
    });
    setTitle("");
  };

  return (
    <div className="grid-container">
      {tasks.map((task) => {
        return (
          <div key={task.id} style={{ display: "flex", alignItems: "center" }}>
            <TodoTask user={user} task={task} setTasks={setTasks} />
          </div>
        );
      })}
      <div className="centered-text">
        <div style={{ display: "flex" }}>
          <TextInput
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <PrimaryButton
            onClick={handleAddClick}
            style={{ marginLeft: "1.5rem" }}
          >
            +
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
