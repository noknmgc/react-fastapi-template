import { axios } from "../../../common/api/axios";

import { Token } from "../../../common/types";

export const login = (username: string, password: string): Promise<Token> => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const response: Promise<Token> = axios
    .post("/login/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((response) => {
      return {
        accessToken: response.data.access_token,
        type: response.data.token_type,
      };
    });
  return response;
};
