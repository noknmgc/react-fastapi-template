import { axios } from "../../../common/api/axios";

import { Token, UserResponse } from "../../../common/types";

export const getUser = (
  token: Token,
  userId: string
): Promise<UserResponse> => {
  const response = axios
    .get(`/users/${userId}`, {
      headers: { Authorization: `${token.type} ${token.accessToken}` },
    })
    .then((response) => {
      const user = response.data;
      return { id: user.signin_id, name: user.name, role: user.role };
    });
  return response;
};
