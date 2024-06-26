import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { getTodoQueryOptions } from "./useTodo";

const deleteTodoTask = (taskId: number, todoId: number) => {
  return todoTasksApi.deleteTodoTask(taskId, todoId).then((r) => r.data);
};

export const useDeleteTodoTask = (todoId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: (taskId: number) => deleteTodoTask(taskId, todoId),
  });
};
