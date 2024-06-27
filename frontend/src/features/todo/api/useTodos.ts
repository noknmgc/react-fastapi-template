import { queryOptions, useQuery } from "@tanstack/react-query";

import { todosApi } from "@/common/api/clients";

const getTodos = () => todosApi.readMyTodos().then((r) => r.data);

export const getTodosQueryOptions = () =>
  queryOptions({
    queryKey: ["my-todos"],
    queryFn: () => getTodos(),
  });

export const useTodos = () => {
  return useQuery({ ...getTodosQueryOptions() });
};
