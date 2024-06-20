import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodosQueryOptions } from "./useTodos";
import { todosApi } from "@/common/api/clients";
import { MyTodoCreate } from "@/openapi";

const createMyTodo = (myTodoCreate: MyTodoCreate) =>
  todosApi.createMyTodo(myTodoCreate);

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTodosQueryOptions().queryKey,
      });
    },
    mutationFn: createMyTodo,
  });
};
