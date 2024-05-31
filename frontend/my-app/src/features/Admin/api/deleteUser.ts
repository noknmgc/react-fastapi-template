import { axios } from "../../../common/api/axios";

import { Token } from "../../../common/types";

export const deleteUser = (token: Token, userId: string) => {
  const response = axios
    .delete(`/users/${userId}`, {
      headers: { Authorization: `${token.type} ${token.accessToken}` },
    })
    .then(() => {
      return null;
    });
  return response;
};
