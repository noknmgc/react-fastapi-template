import { axios } from "../../../common/api/axios";

import { Token, UserRole, UserResponse } from "../../../common/types";

interface UserCreate {
  id: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export const createUser = (
  token: Token,
  body: UserCreate
): Promise<UserResponse> => {
  const response = axios
    .post(
      `/users`,
      {
        signin_id: body.id,
        password: body.password,
        name: body.name ?? "",
        role: body.role ?? "User",
      },
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
