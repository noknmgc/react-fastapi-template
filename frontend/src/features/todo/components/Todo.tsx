import { useParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

import { Button, Checkbox, DebouncedInput } from "@/common/components/ui";
import { useTodo } from "../api/useTodo";
import { useCreateTodoTask } from "../api/createTodoTask";
import { useUpdateTodoTask } from "../api/updateTodoTask";
import { useDeleteTodoTask } from "../api/deleteTodoTask";
import { useUpdateTodo } from "../api/updateTodo";

const Todo: React.FC = () => {
  const { todoId } = useParams();
  const { data: todo, isLoading } = useTodo(parseInt(todoId ?? ""));
  const { mutate: updateTodo } = useUpdateTodo(parseInt(todoId ?? ""));
  const { mutate: createTodoTask } = useCreateTodoTask(parseInt(todoId ?? ""));
  const { mutate: updateTodoTask } = useUpdateTodoTask(parseInt(todoId ?? ""));
  const { mutate: deleteTodoTask } = useDeleteTodoTask(parseInt(todoId ?? ""));

  if (isLoading) return <span>Loading</span>;

  if (!todo) return null;

  return (
    <>
      <DebouncedInput
        className="mb-6 border-none bg-transparent text-2xl focus:bg-white"
        value={todo.name}
        placeholder="Todoタイトル"
        onDebounceChange={(newValue) => {
          updateTodo({ name: newValue });
        }}
      />
      <ul className="space-y-4">
        {todo.tasks.map((task) => (
          <li key={task.id} className="flex items-center space-x-4">
            <DebouncedInput
              className="bg-transparent focus:bg-white"
              value={task.name ?? ""}
              onDebounceChange={(newVaue) => {
                updateTodoTask({
                  taskId: task.id,
                  taskUpdate: { name: newVaue },
                });
              }}
            />
            <Checkbox
              checked={task.done}
              onChange={() => {
                updateTodoTask({
                  taskId: task.id,
                  taskUpdate: { done: !task.done },
                });
              }}
            />
            <Button
              buttonStyle="tertiary"
              className="p-2"
              onClick={() => {
                deleteTodoTask(task.id);
              }}
            >
              <TrashIcon className="size-4 stroke-current stroke-2" />
            </Button>
          </li>
        ))}
        <li className="flex items-center justify-center">
          <Button
            onClick={() => {
              createTodoTask({});
            }}
          >
            <PlusIcon className="stroke size-4 fill-current stroke-current" />
          </Button>
        </li>
      </ul>
    </>
  );
};

export default Todo;
