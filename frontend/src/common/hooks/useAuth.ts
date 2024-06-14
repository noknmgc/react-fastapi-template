import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/clients";
import { myselfQueryOptions, useMyself } from "../api/useMyself";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user } = useMyself();

  /** ログイン済みフラグ */
  const isLoggedIn = useMemo(() => user !== undefined, [user]);

  /**
   * ログイン処理
   *
   * @param username - ユーザー名
   * @param password - パスワード
   */
  const login = useCallback(async (username: string, password: string) => {
    await authApi.loginCookie(username, password);
    queryClient.invalidateQueries({ queryKey: myselfQueryOptions.queryKey });
  }, []);

  /**
   * ログアウト処理
   */
  const logout = useCallback(async () => {
    await authApi.logout();
    queryClient.removeQueries({
      queryKey: myselfQueryOptions.queryKey,
      exact: true,
    });
  }, []);

  return { login, logout, isLoggedIn, user };
};
