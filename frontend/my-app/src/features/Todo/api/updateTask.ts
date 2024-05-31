import { axios } from "../../../common/api/axios";

import { Token, Task } from "../../../common/types";

export const updateTask = (
  token: Token,
  task: Task,
  body: {
    title?: string;
    done?: boolean;
  }
): Promise<Task> => {
  const newTask = axios
    .put(`/tasks/${task.id}`, body, {
      headers: { Authorization: `${token.type} ${token.accessToken}` },
    })
    .then((response) => {
      return {
        id: response.data.id,
        title: response.data.title,
        done: response.data.done,
      };
    });
  return newTask;
};
