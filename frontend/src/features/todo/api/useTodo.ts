import { queryOptions, useQuery } from "@tanstack/react-query";
import { todosApi } from "@/common/api/clients";

export const todoQueryOptions = (todoId: number) =>
  queryOptions({
    queryKey: ["my-todo", todoId],
    queryFn: () => todosApi.readMyTodo(todoId).then((r) => r.data),
  });

export const useTodo = (todoId: number) => {
  return useQuery({ ...todoQueryOptions(todoId) });
};
