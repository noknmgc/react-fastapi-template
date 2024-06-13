import Axios from "axios";

import { UsersApi, AuthApi, TodosApi, TodoTasksApi } from "@/openapi";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    // リクエストが送信される直前の処理
    return config;
  },
  (error) => {
    // リクエストエラーの処理
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    // ステータスコードが 2xx の範囲にある時の処理
    return response;
  },
  (error) => {
    // ステータスコードが 2xx の範囲外にある時の処理
    return Promise.reject(error);
  }
);

export const authApi = new AuthApi(undefined, undefined, axios);
export const usersApi = new UsersApi(undefined, undefined, axios);
export const todosApi = new TodosApi(undefined, undefined, axios);
export const todoTasksApi = new TodoTasksApi(undefined, undefined, axios);
