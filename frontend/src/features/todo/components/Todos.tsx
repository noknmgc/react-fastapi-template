import { Link } from "react-router-dom";
import { useTodos } from "../api/useTodos";

const Todos: React.FC = () => {
  const { data: todos } = useTodos();
  return (
    <>
      <div>Todoマルチ画面</div>
      {todos &&
        todos.map((todo) => (
          <Link to={`${todo.id}`} key={todo.id}>
            {todo.name}
          </Link>
        ))}
    </>
  );
};

export default Todos;
