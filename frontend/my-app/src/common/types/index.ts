export interface User {
  id: string;
  token: string;
  role: "User" | "Admin";
}
