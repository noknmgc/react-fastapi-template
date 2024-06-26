import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { TaskCreate } from "@/openapi";
import { getTodoQueryOptions } from "./useTodo";

const createTodoTask = (todoId: number, taskCreate: TaskCreate) => {
  return todoTasksApi.createTask(todoId, taskCreate).then((r) => r.data);
};

export const useCreateTodoTask = (todoId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: (taskCreate: TaskCreate) => createTodoTask(todoId, taskCreate),
  });
};
