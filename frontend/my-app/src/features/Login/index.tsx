import { useNavigate } from "react-router-dom";

import { User } from "../../common/types";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    setUser({ id: "test", token: "test", role: "Admin" });
    navigate("/todo", { replace: true });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>login</button>
    </div>
  );
};

export default Login;
