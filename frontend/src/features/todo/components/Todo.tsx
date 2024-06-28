import { useParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

import {
  Button,
  Checkbox,
  DebouncedInput,
  Spinner,
} from "@/common/components/ui";
import { cn } from "@/common/utils/classname";
import { TaskResponse } from "@/openapi";
import { useDialogStore } from "@/stores/dialog";
import { useTodo } from "../api/useTodo";
import { useCreateTodoTask } from "../api/createTodoTask";
import { useUpdateTodoTask } from "../api/updateTodoTask";
import { useDeleteTodoTask } from "../api/deleteTodoTask";
import { useUpdateTodo } from "../api/updateTodo";

const Todo: React.FC = () => {
  const { todoId } = useParams();
  const todoIdNum = parseInt(todoId ?? "");
  const { data: todo } = useTodo(todoIdNum);
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: createTodoTask, isPending: isPendingCreate } =
    useCreateTodoTask();
  const { mutate: updateTodoTask } = useUpdateTodoTask();
  const {
    mutate: deleteTodoTask,
    isPending: isPendingDelete,
    variables: variablesDelete,
  } = useDeleteTodoTask();

  const openConfirmDialog = useDialogStore.use.openConfirmDialog();

  if (!todo) return null;

  const handleDelete = (task: TaskResponse) => {
    if (task.done || task.name === "")
      deleteTodoTask({ todoId: todoIdNum, taskId: task.id });
    else {
      openConfirmDialog({
        title: "タスク削除",
        description: `「${task.name}」は、完了していません。本当に削除しますか？`,
        isWarning: true,
        onConfirm: () => {
          deleteTodoTask({ todoId: todoIdNum, taskId: task.id });
        },
        customText: { confirm: "削除" },
      });
    }
  };

  return (
    <>
      <DebouncedInput
        className="mb-6 border-none bg-transparent text-2xl font-bold focus:bg-white"
        value={todo.name}
        placeholder="Todoタイトル"
        onDebounceChange={(newValue) => {
          updateTodo({ todoId: todoIdNum, todoUpdate: { name: newValue } });
        }}
      />
      <ul className="space-y-4">
        {todo.tasks.map((task) => {
          const isPendingDeleteTask =
            isPendingDelete && variablesDelete?.taskId === task.id;
          return (
            <li key={task.id} className="flex items-center space-x-4">
              <DebouncedInput
                className={cn(
                  "bg-transparent focus:bg-white",
                  task.done &&
                    "border-transparent line-through hover:border-transparent",
                )}
                value={task.name ?? ""}
                onDebounceChange={(newVaue) => {
                  updateTodoTask({
                    todoId: todoIdNum,
                    taskId: task.id,
                    taskUpdate: { name: newVaue },
                  });
                }}
              />
              <Checkbox
                checked={task.done}
                onChange={() => {
                  updateTodoTask({
                    todoId: todoIdNum,
                    taskId: task.id,
                    taskUpdate: { done: !task.done },
                  });
                }}
              />
              <Button
                buttonStyle="tertiary"
                className="p-2"
                onClick={() => {
                  handleDelete(task);
                }}
                disabled={isPendingDeleteTask}
              >
                {isPendingDeleteTask ? (
                  <Spinner className="size-4" />
                ) : (
                  <TrashIcon className="size-4 stroke-current stroke-2" />
                )}
              </Button>
            </li>
          );
        })}
        <li className="flex items-center justify-center">
          <Button
            onClick={() => {
              createTodoTask({ todoId: todoIdNum, taskCreate: {} });
            }}
            disabled={isPendingCreate}
          >
            {isPendingCreate ? (
              <Spinner className="size-4" />
            ) : (
              <PlusIcon className="stroke size-4 fill-current stroke-current" />
            )}
          </Button>
        </li>
      </ul>
    </>
  );
};

export default Todo;
