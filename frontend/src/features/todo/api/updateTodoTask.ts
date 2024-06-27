import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { TaskUpdate, TodoResponse } from "@/openapi";
import { getTodoQueryOptions } from "./useTodo";

const updateTodoTask = ({
  taskId,
  todoId,
  taskUpdate,
}: {
  taskId: number;
  todoId: number;
  taskUpdate: TaskUpdate;
}) => {
  return todoTasksApi
    .updateTodoTask(taskId, todoId, taskUpdate)
    .then((r) => r.data);
};

export const useUpdateTodoTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (_data, { todoId }) => {
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: updateTodoTask,
    onMutate: async ({ todoId, taskId, taskUpdate }) => {
      /* mutation実行時、楽観的更新を行う */
      // デフォルトの更新をキャンセル
      await queryClient.cancelQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
      // 現在のデータを取得
      const prevTodo = queryClient.getQueryData(
        getTodoQueryOptions(todoId).queryKey,
      );
      if (prevTodo === undefined) return { prevTodo };

      // データを手動で更新
      const newTodo: TodoResponse = {
        ...prevTodo,
        tasks: prevTodo.tasks.map((task) => {
          if (task.id === taskId) {
            const { name, done } = taskUpdate;
            return {
              ...task,
              name: typeof name === "string" ? name : task.name,
              done: typeof done === "boolean" ? done : task.done,
            };
          } else return task;
        }),
      };
      queryClient.setQueryData(getTodoQueryOptions(todoId).queryKey, newTodo);
      return { prevTodo, newTodo };
    },
    onError: (_err, { todoId }, context) => {
      // mutation失敗時、キャッシュを元の値に戻す
      queryClient.setQueryData(
        getTodoQueryOptions(todoId).queryKey,
        context?.prevTodo,
      );
    },
    onSettled: (_data, _err, { todoId }) => {
      // mutation終了時(エラー有無問わず)、キャッシュを更新
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
  });
};
