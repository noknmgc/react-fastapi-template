import { useParams } from "react-router-dom";

import { Button, Checkbox } from "@/common/components/ui";
import { useTodo } from "../api/useTodo";
import { useCreateTodoTask } from "../api/createTodoTask";

const Todo: React.FC = () => {
  const { todoId } = useParams();
  const { data: todo } = useTodo(parseInt(todoId ?? ""));
  const { mutate: createTodoTask } = useCreateTodoTask(parseInt(todoId ?? ""));

  return (
    <>
      <div>Todoシングル画面</div>
      {todo &&
        todo.tasks.map((task) => (
          <div key={task.id}>
            {task.name} <Checkbox checked={task.done} onChange={() => {}} />
          </div>
        ))}
      <Button
        onClick={() => {
          createTodoTask({});
        }}
      >
        +
      </Button>
      <Checkbox />
    </>
  );
};

export default Todo;
