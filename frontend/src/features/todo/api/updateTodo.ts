import { useQueryClient, useMutation } from "@tanstack/react-query";
import { todosApi } from "@/common/api/clients";
import { TodoUpdate } from "@/openapi";
import { getTodoQueryOptions } from "./useTodo";
import { getTodosQueryOptions } from "./useTodos";

const updateTodo = (todoId: number, todoUpdate: TodoUpdate) =>
  todosApi.updateMyTodo(todoId, todoUpdate).then((r) => r.data);

export const useUpdateTodo = (todoId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTodoQueryOptions(todoId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getTodosQueryOptions().queryKey,
      });
    },
    mutationFn: (todoUpdate: TodoUpdate) => updateTodo(todoId, todoUpdate),
  });
};
