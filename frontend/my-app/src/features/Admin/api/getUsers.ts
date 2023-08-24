import { axios } from "../../../common/api/axios";

import { Token, UserRole, UserResponse } from "../../../common/types";

export const getUsers = (
  token: Token,
  skip: number = 0,
  limit: number = 100
): Promise<UserResponse[]> => {
  const response = axios
    .get(`/users?skip=${skip}&limit=${limit}`, {
      headers: { Authorization: `${token.type} ${token.accessToken}` },
    })
    .then((response) => {
      return response.data.map((user: any) => {
        return { id: user.signin_id, name: user.name, role: user.role };
      });
    });
  return response;
};
