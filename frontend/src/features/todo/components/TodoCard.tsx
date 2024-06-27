import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { Button, DebouncedInput, Loading } from "@/common/components/ui";
import { TodoResponse } from "@/openapi";
import { useDialogStore } from "@/stores/dialog";
import { useUpdateTodo } from "../api/updateTodo";
import { useDeleteTodo } from "../api/deleteTodo";

interface TodoCardProps {
  todo: TodoResponse;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo, isPending: isPendingDelete } = useDeleteTodo();
  const navigate = useNavigate();
  const navigateTodo = () => {
    if (!isPendingDelete) navigate(`/todos/${todo.id}`);
  };

  const openConfirmDialog = useDialogStore.use.openConfirmDialog();

  const [completed, incompleted] = useMemo(() => {
    return [
      todo.tasks.filter((t) => t.done),
      todo.tasks.filter((t) => !t.done),
    ];
  }, [todo.tasks]);

  const handleDelete = () => {
    if (incompleted.length === 0) deleteTodo(todo.id);
    else {
      openConfirmDialog({
        title: "TODOの削除",
        description: "まだ完了していないタスクがあります。本当に削除しますか？",
        isWarning: true,
        onConfirm: () => {
          deleteTodo(todo.id);
        },
        customText: { confirm: "削除" },
      });
    }
  };

  return (
    <div
      onDoubleClick={() => {
        navigateTodo();
      }}
      className="block w-full rounded-lg border-2 border-primary p-2"
    >
      {isPendingDelete ? (
        <Loading className="relative top-[50%] -translate-y-[50%]" />
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <DebouncedInput
              className="border-none bg-transparent text-xl font-bold focus:bg-white"
              value={todo.name}
              placeholder="名称なし"
              onDebounceChange={(newValue) => {
                updateTodo({ todoId: todo.id, todoUpdate: { name: newValue } });
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
            <Button
              buttonStyle="tertiary"
              className="p-2"
              onClick={handleDelete}
              disabled={isPendingDelete}
            >
              <TrashIcon className="size-4 stroke-current stroke-2" />
            </Button>
          </div>

          <div className="ml-2 mt-4 flex items-center space-x-4 text-sm text-slate-500">
            <span>未完了タスク：{incompleted.length}件</span>
            <span>完了タスク：{completed.length}件</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoCard;
