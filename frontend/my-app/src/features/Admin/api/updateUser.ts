import { axios } from "../../../common/api/axios";

import { Token, UserResponse } from "../../../common/types";

interface UserUpdate {
  id?: string;
  name?: string;
  password?: string;
}

export const updateUser = (
  token: Token,
  userId: string,
  body: UserUpdate
): Promise<UserResponse> => {
  const response = axios
    .put(
      `/users/${userId}`,
      { signin_id: body.id, password: body.password, name: body.name },
      {
        headers: { Authorization: `${token.type} ${token.accessToken}` },
      }
    )
    .then((response) => {
      const user = response.data;
      return { id: user.signin_id, name: user.name, role: user.role };
    });
  return response;
};
