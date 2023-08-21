import { useLayoutEffect, useState } from "react";

import { User, Task, Token } from "../../common/types";
import { getTasks } from "./api/getTasks";
import TaskList from "./components/TaskList";

interface TodoProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Todo: React.FC<TodoProps> = ({ user, setUser }) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  useLayoutEffect(() => {
    const getNewTasks = async (token: Token) => {
      const newTasks = await getTasks(token);
      setTaskList(newTasks);
    };

    if (user) {
      getNewTasks(user.token);
    }
  }, [user]);

  return (
    <div className="centered-box50">
      <h1 className="centered-text">todo</h1>
      {user ? (
        <TaskList user={user} tasks={taskList} setTasks={setTaskList} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Todo;
