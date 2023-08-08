import { axios } from "../../../common/api/axios";

import { Token, UserRole } from "../../../common/types";

type UserResponse = {
  siginin_id: string;
  name: string;
  role: UserRole;
};

export const getCurrentUser = (token: Token): Promise<UserResponse> => {
  const response = axios
    .get("/users/myself", {
      headers: { Authorization: `${token.type} ${token.accessToken}` },
    })
    .then((response) => response.data);
  return response;
};
