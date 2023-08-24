import { USER_ROLES } from "../constants";

export interface Token {
  accessToken: string;
  type: string;
}

export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  token: Token;
  role: UserRole;
}

export interface UserResponse {
  id: string;
  name: string;
  role: UserRole;
}

export interface Task {
  id: number;
  title: string;
  done: boolean;
}
