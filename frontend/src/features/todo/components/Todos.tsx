import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@/common/components/ui";

import { useTodos } from "../api/useTodos";
import { useCreateTodo } from "../api/createTodo";
import TodoCard from "./TodoCard";

const Todos: React.FC = () => {
  const { data: todos } = useTodos();
  const { mutate: createTodo } = useCreateTodo();
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-2">
      {todos && todos.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
      <Button
        buttonStyle="secondary"
        onClick={() => {
          createTodo({});
        }}
      >
        <PlusIcon className="inline-block size-10 fill-current" />
      </Button>
    </div>
  );
};

export default Todos;
