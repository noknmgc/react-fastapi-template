import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/common/api/clients";
import { UserUpdate } from "@/openapi";
import { getUsersQueryOptions } from "./useUsers";

const updateUser = ({
  username,
  userUpdate,
}: {
  username: string;
  userUpdate: UserUpdate;
}) => usersApi.updateUser(username, userUpdate);

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
    },
    mutationFn: updateUser,
  });
};
