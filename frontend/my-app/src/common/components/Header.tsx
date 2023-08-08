import { NavLink, useNavigate } from "react-router-dom";

import { User } from "../types";

import { adminPaths } from "../../routes/AdminRoutes";
import { userPaths } from "../../routes/UserRoutes";
import { publicPaths } from "../../routes/PublicRoutes";

interface HeaderProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Header: React.FC<HeaderProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  let links: { path: string; name: string }[] = [];
  switch (user?.role) {
    case "Admin":
      links = Object.entries(adminPaths).map(([, value]) => value);
      break;
    case "User":
      links = Object.entries(userPaths).map(([, value]) => value);
      break;
    default:
      links = Object.entries(publicPaths).map(([, value]) => value);
  }

  const handleLogout = () => {
    setUser(null);
    navigate(publicPaths.login.path, { replace: true });
  };

  return (
    <header className="header">
      <h1 className="header-logo">React-FastAPI-Template</h1>
      <nav>
        <ul className="header-list">
          {links.map((link) => {
            return (
              <li key={link.name}>
                <NavLink
                  key={link.name}
                  to={link.path}
                  style={({ isActive, isPending }) => {
                    return {
                      fontWeight: isActive ? "bold" : "",
                      color: isPending ? "red" : "black",
                    };
                  }}
                >
                  {link.name}
                </NavLink>
              </li>
            );
          })}
          {user ? (
            <li>
              <button onClick={handleLogout}>logout</button>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
