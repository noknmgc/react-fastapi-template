import { axios } from "../../../common/api/axios";

import { Task, Token } from "../../../common/types";

export const getTasks = (token: Token): Promise<Task[]> => {
  const response = axios
    .get("/tasks", {
      headers: { Authorization: `${token.type} ${token.accessToken}` },
    })
    .then((response) => {
      return response.data
        .map((data: any) => {
          return { id: data.id, title: data.title, done: data.done };
        })
        .sort((a: Task, b: Task) => a.id - b.id);
    });
  return response;
};
