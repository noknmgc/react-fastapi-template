import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "../../common/types";
import { login } from "./api/login";
import { getCurrentUser } from "./api/getUser";
import { userPaths } from "../../routes/UserRoutes";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setPassword(e.target.value);
  };

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const token = await login(username, password).catch((error) => {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      window.alert(
        status && detail ? `${status} : ${detail}` : "Something happened"
      );
    });
    if (!!!token) return;

    const userData = await getCurrentUser(token);
    if (!!!userData) return;

    setUser({
      id: userData.siginin_id,
      token: token,
      role: userData.role,
    });
    navigate(userPaths.todo.path, { replace: true });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>id:</label>
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label>password:</label>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
