import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./common/api/react-query";
import { useMyself } from "./common/api/useMyself";
import { authApi } from "./common/api/clients";

function App() {
  authApi.loginCookie("test", "test");
  return (
    <QueryClientProvider client={queryClient}>
      <Test />
    </QueryClientProvider>
  );
}

const Test: React.FC = () => {
  const { data, isLoading, isError } = useMyself();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something happened!</div>;
  if (!data) return <div>Data is undefined.</div>;
  return <div>{data.username}</div>;
};
export default App;
