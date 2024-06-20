import { queryOptions, useQuery } from "@tanstack/react-query";
import { todosApi } from "@/common/api/clients";

const getTodo = (todoId: number) =>
  todosApi.readMyTodo(todoId).then((r) => r.data);

export const getTodoQueryOptions = (todoId: number) =>
  queryOptions({
    queryKey: ["my-todo", todoId],
    queryFn: () => getTodo(todoId),
  });

export const useTodo = (todoId: number) => {
  return useQuery({ ...getTodoQueryOptions(todoId) });
};
