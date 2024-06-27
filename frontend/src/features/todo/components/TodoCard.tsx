import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button, DebouncedInput } from "@/common/components/ui";
import { TodoResponse } from "@/openapi";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useUpdateTodo } from "../api/updateTodo";

interface TodoCardProps {
  todo: TodoResponse;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { mutate: updateTodo } = useUpdateTodo(todo.id);
  const navigate = useNavigate();
  const navigateTodo = () => {
    navigate(`/todos/${todo.id}`);
  };

  const [completed, incompleted] = useMemo(() => {
    return [
      todo.tasks.filter((t) => t.done),
      todo.tasks.filter((t) => !t.done),
    ];
  }, [todo.tasks]);

  return (
    <div
      onDoubleClick={() => {
        navigateTodo();
      }}
      className="block w-full rounded-lg border-2 border-primary p-2"
    >
      <div className="flex items-center space-x-4">
        <DebouncedInput
          className="border-none bg-transparent text-xl font-bold focus:bg-white"
          value={todo.name}
          placeholder="名称なし"
          onDebounceChange={(newValue) => {
            updateTodo({ name: newValue });
          }}
        />
        <Button
          className="p-2"
          onClick={() => {
            navigateTodo();
          }}
        >
          <ArrowTopRightOnSquareIcon className="size-4 stroke-current" />
        </Button>
        <Button buttonStyle="warn" className="p-2" onClick={() => {}}>
          <TrashIcon className="size-4 stroke-current stroke-2" />
        </Button>
      </div>
      <div className="ml-2 mt-4 flex items-center space-x-4 text-sm text-slate-500">
        <span>未完了タスク：{incompleted.length}件</span>
        <span>完了タスク：{completed.length}件</span>
      </div>
    </div>
  );
};

export default TodoCard;
