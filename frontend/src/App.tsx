import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./common/api/react-query";
import { AppRouter } from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
export default App;
