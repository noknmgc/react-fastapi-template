import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "./api/login";
import { getCurrentUser } from "./api/getUser";

import PrimaryButton from "../../common/components/button/PrimaryButton";
import LabeledInput from "../../common/components/input/LabeledInput";

import { userPaths } from "../../routes/UserRoutes";
import { User } from "../../common/types";

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
      throw error;
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
      <h1 className="centered-text">React-FastAPI-Template</h1>
      <form className="centered-box50" onSubmit={handleLogin}>
        <div className="grid-container">
          <LabeledInput
            label="id"
            type="text"
            name="username"
            required
            value={username}
            onChange={handleUsernameChange}
          />

          <LabeledInput
            label="password"
            type="password"
            name="password"
            required
            value={password}
            onChange={handlePasswordChange}
          />
          <div className="centered-text">
            <PrimaryButton type="submit">Submit</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
