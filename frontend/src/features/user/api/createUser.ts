import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/common/api/clients";
import { UserCreate } from "@/openapi";
import { getUsersQueryOptions } from "./useUsers";

const createUser = (userCreate: UserCreate) => usersApi.createUser(userCreate);

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
    },
    mutationFn: createUser,
  });
};
