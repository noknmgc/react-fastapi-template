import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todosApi } from "@/common/api/clients";
import { getTodosQueryOptions } from "./useTodos";
import { getTodoQueryOptions } from "./useTodo";

const deleteMyTodo = (todoId: number) =>
  todosApi.deleteMyTodo(todoId).then((r) => r.data);

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (_data, todoId, _context) => {
      queryClient.invalidateQueries({
        queryKey: getTodosQueryOptions().queryKey,
      });
      queryClient.removeQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
    },
    mutationFn: deleteMyTodo,
  });
};
