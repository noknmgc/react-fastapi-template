import { useParams } from "react-router-dom";

import { Button, Checkbox } from "@/common/components/ui";
import { useTodo } from "../api/useTodo";
import { useCreateTodoTask } from "../api/createTodoTask";
import { useUpdateTodoTask } from "../api/updateTodoTask";

const Todo: React.FC = () => {
  console.log("render todo");
  const { todoId } = useParams();
  const { data: todo } = useTodo(parseInt(todoId ?? ""));
  const { mutate: createTodoTask } = useCreateTodoTask(parseInt(todoId ?? ""));
  const { mutate: updateTodoTask } = useUpdateTodoTask(parseInt(todoId ?? ""));

  return (
    <>
      <div>Todoシングル画面</div>
      {todo &&
        todo.tasks.map((task) => (
          <div key={task.id}>
            {task.name}{" "}
            <Checkbox
              checked={task.done}
              onChange={() => {
                updateTodoTask({
                  taskId: task.id,
                  taskUpdate: { done: !task.done },
                });
              }}
            />
          </div>
        ))}
      <Button
        onClick={() => {
          createTodoTask({});
        }}
      >
        +
      </Button>
    </>
  );
};

export default Todo;
