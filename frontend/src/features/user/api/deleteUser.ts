import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/common/api/clients";
import { getUsersQueryOptions } from "./useUsers";

const deleteUser = (username: string) => usersApi.deleteUser(username);

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
    },
    mutationFn: deleteUser,
  });
};
