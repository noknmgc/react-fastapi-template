import Axios from "axios";

import { UsersApi, AuthApi, TodosApi, TodoTasksApi } from "@/openapi";
import { logger } from "../utils/logger";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    // リクエストが送信される直前の処理
    logger.log(
      `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.data ?? "",
    );
    return config;
  },
  (error) => {
    // リクエストエラーの処理
    logger.error("Request error:", error);
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  (response) => {
    // ステータスコードが 2xx の範囲にある時の処理
    logger.log(
      `Response ${response.request?.responseURL} ${response.status} (${response.statusText})`,
      response.data ?? "",
    );
    return response;
  },
  (error) => {
    // ステータスコードが 2xx の範囲外にある時の処理
    if (error.response) {
      logger.error("HTTP error:", error);
      // responseのdataにdetailがある場合は、alertで表示
      // 401は、自動的にログイン画面へリダイレクトされるので通知の必要なし
      if (error.response?.data?.detail && error.response?.status !== 401) {
        window.alert(
          `${error.response.status} ${error.response.statusText}\n${error.response.data.detail}`,
        );
      }
    } else if (error.request) {
      logger.error("Request was sent but there is no response", error);
    } else {
      logger.error("Something happened:", error);
    }
    return Promise.reject(error);
  },
);

export const authApi = new AuthApi(undefined, undefined, axios);
export const usersApi = new UsersApi(undefined, undefined, axios);
export const todosApi = new TodosApi(undefined, undefined, axios);
export const todoTasksApi = new TodoTasksApi(undefined, undefined, axios);
