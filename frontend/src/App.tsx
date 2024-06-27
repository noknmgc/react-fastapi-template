import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./common/api/react-query";
import { Dialog } from "./common/components/dialog";
import { AppRouter } from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Dialog />
    </QueryClientProvider>
  );
}
export default App;
