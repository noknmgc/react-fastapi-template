import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { TaskCreate } from "@/openapi";
import { getTodoQueryOptions } from "./useTodo";
import { getTodosQueryOptions } from "./useTodos";

const createTodoTask = ({
  todoId,
  taskCreate,
}: {
  todoId: number;
  taskCreate: TaskCreate;
}) => {
  return todoTasksApi.createTask(todoId, taskCreate).then((r) => r.data);
};

export const useCreateTodoTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (_data, { todoId }, _context) => {
      queryClient.invalidateQueries({
        queryKey: getTodosQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: createTodoTask,
  });
};
