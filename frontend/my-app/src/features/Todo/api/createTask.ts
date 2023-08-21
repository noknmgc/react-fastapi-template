import { axios } from "../../../common/api/axios";

import { Token, Task } from "../../../common/types";

export const createTask = (token: Token, title: string = ""): Promise<Task> => {
  const newTask = axios
    .post(
      "/tasks",
      { title },
      {
        headers: { Authorization: `${token.type} ${token.accessToken}` },
      }
    )
    .then((response) => {
      return {
        id: response.data.id,
        title: response.data.title,
        done: response.data.done,
      };
    });
  return newTask;
};
