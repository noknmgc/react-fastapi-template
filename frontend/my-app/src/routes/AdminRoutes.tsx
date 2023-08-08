import { Routes, Route, Outlet } from "react-router-dom";

import { User } from "../common/types";
import Todo from "../features/Todo";
import Admin from "../features/Admin";
import Header from "../common/components/Header";

export const adminPaths = {
  todo: { path: "/todo", name: "Todo" },
  admin: { path: "/admin", name: "Admin" },
};

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

const AdminRoutes: React.FC<PrivateRoutesProps> = ({ user, setUser }) => {
  return (
    <Routes>
      <Route path="/" element={<App user={user} setUser={setUser} />}>
        <Route path={adminPaths.todo.path} element={<Todo />} />
        <Route path={adminPaths.admin.path} element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
