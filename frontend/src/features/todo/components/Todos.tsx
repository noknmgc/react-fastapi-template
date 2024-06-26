import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@/common/components/ui";

import { useTodos } from "../api/useTodos";
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
        <PlusIcon className="stroke inline-block size-4 fill-current stroke-current" />
      </Button>
    </div>
  );
};

export default Todos;
