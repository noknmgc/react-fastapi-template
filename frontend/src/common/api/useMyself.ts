import { queryOptions, useQuery } from "@tanstack/react-query";
import { usersApi } from "./clients";

export const myselfQueryOptions = queryOptions({
  queryKey: ["myself"],
  queryFn: () => usersApi.readMyself().then((r) => r.data),
});

export const useMyself = () => {
  return useQuery({ ...myselfQueryOptions });
};
