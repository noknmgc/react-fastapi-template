import { useTodos } from "../api/useTodos";
import { Button } from "@/common/components/ui/Buttons";
import { useCreateTodo } from "../api/createTodo";
import TodoCard from "./TodoCard";

const Todos: React.FC = () => {
  const { data: todos } = useTodos();
  const { mutate: createTodo } = useCreateTodo();
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {todos && todos.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
      <Button
        onClick={() => {
          createTodo({});
        }}
      >
        +
      </Button>
    </div>
  );
};

export default Todos;
