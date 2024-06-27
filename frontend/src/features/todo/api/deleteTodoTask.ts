import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { getTodoQueryOptions } from "./useTodo";
import { getTodosQueryOptions } from "./useTodos";

const deleteTodoTask = ({
  taskId,
  todoId,
}: {
  taskId: number;
  todoId: number;
}) => {
  return todoTasksApi.deleteTodoTask(taskId, todoId).then((r) => r.data);
};

export const useDeleteTodoTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (_data, { todoId }) => {
      queryClient.invalidateQueries({
        queryKey: getTodosQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: deleteTodoTask,
  });
};
