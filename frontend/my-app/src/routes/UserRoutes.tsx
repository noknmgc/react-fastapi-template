import { Routes, Route, Outlet } from "react-router-dom";

import { User } from "../common/types";
import Todo from "../features/Todo";
import Header from "../common/components/Header";

const App: React.FC<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}> = ({ user, setUser }) => {
  return (
    <>
      <Header user={user} setUser={setUser} />
      <Outlet />
    </>
  );
};

interface PrivateRoutesProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserRoutes: React.FC<PrivateRoutesProps> = ({ user, setUser }) => {
  return (
    <Routes>
      <Route path="/" element={<App user={user} setUser={setUser} />}>
        <Route path={userPaths.todo.path} element={<Todo />} />
      </Route>
    </Routes>
  );
};

export const userPaths = {
  todo: { path: "/todo", name: "Todo" },
};

export default UserRoutes;
