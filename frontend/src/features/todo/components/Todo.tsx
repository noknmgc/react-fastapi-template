import { useParams } from "react-router-dom";

import { Button, Checkbox, DebouncedInput } from "@/common/components/ui";
import { useTodo } from "../api/useTodo";
import { useCreateTodoTask } from "../api/createTodoTask";
import { useUpdateTodoTask } from "../api/updateTodoTask";

const Todo: React.FC = () => {
  const { todoId } = useParams();
  const { data: todo } = useTodo(parseInt(todoId ?? ""));
  const { mutate: createTodoTask } = useCreateTodoTask(parseInt(todoId ?? ""));
  const { mutate: updateTodoTask } = useUpdateTodoTask(parseInt(todoId ?? ""));

  return (
    <>
      <DebouncedInput
        className="mb-6"
        value={todo?.name ?? ""}
        placeholder="Todoタイトル"
        onDebounceChange={(newValue) => {}}
      />
      {todo && (
        <ul className="space-y-4">
          {todo.tasks.map((task) => (
            <li key={task.id} className="flex items-center space-x-4">
              <DebouncedInput
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
            </li>
          ))}
          <li className="flex items-center justify-center">
            <Button
              onClick={() => {
                createTodoTask({});
              }}
            >
              +
            </Button>
          </li>
        </ul>
      )}
    </>
  );
};

export default Todo;
