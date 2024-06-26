import { useParams } from "react-router-dom";

import { Checkbox } from "@/common/components/ui";
import { useTodo } from "../api/useTodo";

const Todo: React.FC = () => {
  const { todoId } = useParams();
  const { data: todo } = useTodo(parseInt(todoId ?? ""));
  return (
    <>
      <div>Todoシングル画面</div>
      {todo &&
        todo.tasks.map((task) => (
          <div key={task.id}>
            {task.name} <Checkbox checked={task.done} onChange={() => {}} />
          </div>
        ))}
      <Checkbox />
    </>
  );
};

export default Todo;
