import { useAuth } from "@/common/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

import logo from "@/assets/react.svg";
import { Button } from "../ui";

interface Props {
  children: React.ReactNode;
}

export const CommonLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <header>
        <nav className="bg-primary py-3 text-gray-100">
          <div className="mx-auto flex max-w-screen-lg items-center justify-between">
            <Link className="flex items-center" to="/">
              <img src={logo} width={30} height={30} alt="logo" />
              <span className="ml-2 font-bold">React FastAPI Template</span>
            </Link>
            {!!user && (
              <div className="flex items-center space-x-8">
                <Link to="/todos">Todos</Link>
                {user.is_superuser && <Link to="/users">Users</Link>}

                <div className="flex items-center space-x-2">
                  <label>{user.username}:</label>
                  <Button
                    buttonStyle="tertiary"
                    className="px-2 py-0 text-slate-50"
                    onClick={async () => {
                      await logout();
                      navigate("/login");
                    }}
                  >
                    ログアウト
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      <div className="mx-auto mt-8 max-w-screen-lg">{children}</div>
    </>
  );
};
