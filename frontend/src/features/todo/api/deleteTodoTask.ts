import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todoTasksApi } from "@/common/api/clients";
import { getTodoQueryOptions } from "./useTodo";

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
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: deleteTodoTask,
  });
};
