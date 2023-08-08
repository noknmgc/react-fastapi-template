import { Routes, Route, Navigate } from "react-router-dom";

import { User } from "../common/types";
import Login from "../features/Login";

export const publicPaths = {
  login: { path: "/login", name: "Login" },
};

interface PublicRoutesProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const PublicRoutes: React.FC<PublicRoutesProps> = ({ user, setUser }) => {
  return (
    <Routes>
      <Route
        path={publicPaths.login.path}
        element={<Login setUser={setUser} />}
      />
      <Route path="/*" element={<Navigate to={publicPaths.login.path} />} />
    </Routes>
  );
};

export default PublicRoutes;
