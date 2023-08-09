export interface Token {
  accessToken: string;
  type: string;
}

export type UserRole = "User" | "Admin";

export interface User {
  id: string;
  token: Token;
  role: UserRole;
}

export interface Task {
  id: number;
  title: string;
  done: boolean;
}
