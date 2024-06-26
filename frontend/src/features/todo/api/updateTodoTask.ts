import { todoTasksApi } from "@/common/api/clients";
import { TaskUpdate, TodoResponse } from "@/openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoQueryOptions } from "./useTodo";

const updateTodoTask = (
  taskId: number,
  todoId: number,
  taskUpdate: TaskUpdate,
) => {
  return todoTasksApi
    .updateTodoTask(taskId, todoId, taskUpdate)
    .then((r) => r.data);
};

export const useUpdateTodoTask = (todoId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: ({
      taskId,
      taskUpdate,
    }: {
      taskId: number;
      taskUpdate: TaskUpdate;
    }) => updateTodoTask(taskId, todoId, taskUpdate),
    onMutate: async ({ taskId, taskUpdate }) => {
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
    onError: (_err, _variables, context) => {
      // mutation失敗時、キャッシュを元の値に戻す
      queryClient.setQueryData(
        getTodoQueryOptions(todoId).queryKey,
        context?.prevTodo,
      );
    },
    onSettled: () => {
      // mutation終了時(エラー有無問わず)、キャッシュを更新
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
  });
};
