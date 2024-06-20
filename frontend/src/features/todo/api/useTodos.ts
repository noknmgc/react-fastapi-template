import { queryOptions, useQuery } from "@tanstack/react-query";
import { todosApi } from "@/common/api/clients";

export const todosQueryOptions = () =>
  queryOptions({
    queryKey: ["my-todos"],
    queryFn: () => todosApi.readMyTodos().then((r) => r.data),
  });

export const useTodos = () => {
  return useQuery({ ...todosQueryOptions() });
};
