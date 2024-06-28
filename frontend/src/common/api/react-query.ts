import { DefaultOptions, QueryClient } from "@tanstack/react-query";

/**
 * tanstack-queryの設定値
 */
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

/**
 * App全体に適用するclient
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
