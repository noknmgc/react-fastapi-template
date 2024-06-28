import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { usersApi } from "@/common/api/clients";

const getUsers = () => usersApi.readUsers().then((r) => r.data);

export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: getUsers,
  });

export const useUsers = () => {
  return useSuspenseQuery({ ...getUsersQueryOptions() });
};
