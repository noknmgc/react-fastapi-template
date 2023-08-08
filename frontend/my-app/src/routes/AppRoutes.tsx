import { BrowserRouter as Router } from "react-router-dom";

import { User } from "../common/types";
import UserRoutes from "./UserRoutes";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";

interface AppRoutesProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user, setUser }) => {
  let Routes = PublicRoutes;

  switch (user?.role) {
    case "User":
      Routes = UserRoutes;
      break;
    case "Admin":
      Routes = AdminRoutes;
      break;
    default:
      Routes = PublicRoutes;
  }

  return (
    <Router>
      <Routes user={user} setUser={setUser} />
    </Router>
  );
};

export default AppRoutes;
