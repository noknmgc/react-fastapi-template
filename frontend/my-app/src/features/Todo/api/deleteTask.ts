import { axios } from "../../../common/api/axios";

import { Token, Task } from "../../../common/types";

export const deleteTask = (token: Token, task: Task) => {
  axios.delete(`/tasks/${task.id}`, {
    headers: { Authorization: `${token.type} ${token.accessToken}` },
  });
};
