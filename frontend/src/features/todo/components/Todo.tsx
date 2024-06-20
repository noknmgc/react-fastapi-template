import { useParams } from "react-router-dom";
import { useTodo } from "../api/useTodo";

const Todo: React.FC = () => {
  const { todoId } = useParams();
  const { data: todo } = useTodo(parseInt(todoId ?? ""));
  return (
    <>
      <div>Todoシングル画面</div>
      {todo && todo.tasks.map((task) => <div key={task.id}>{task.name}</div>)}
    </>
  );
};

export default Todo;
