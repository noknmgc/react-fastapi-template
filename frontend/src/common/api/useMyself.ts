import { useQuery } from "@tanstack/react-query";
import { usersApi } from "./clients";

export const useMyself = () => {
  return useQuery({
    queryKey: ["myself"],
    queryFn: () => usersApi.readMyself().then((r) => r.data),
  });
};
