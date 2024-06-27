import { queryOptions, useQuery } from "@tanstack/react-query";

import { todosApi } from "@/common/api/clients";
import { getTodosQueryOptions } from "./useTodos";

const getTodo = (todoId: number) =>
  todosApi.readMyTodo(todoId).then((r) => r.data);

export const getTodoQueryOptions = (todoId: number) =>
  queryOptions({
    queryKey: [getTodosQueryOptions().queryKey, todoId],
    queryFn: () => getTodo(todoId),
  });

export const useTodo = (todoId: number) => {
  return useQuery({ ...getTodoQueryOptions(todoId) });
};
