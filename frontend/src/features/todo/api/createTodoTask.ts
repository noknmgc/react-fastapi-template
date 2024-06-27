import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { TaskCreate } from "@/openapi";
import { getTodoQueryOptions } from "./useTodo";

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
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: createTodoTask,
  });
};
