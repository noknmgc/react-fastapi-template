import { useState } from "react";

import { User } from "./common/types";

import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <div className="App">
      <AppRoutes user={user} setUser={setUser} />
    </div>
  );
}

export default App;
