import { useAuth } from "@/common/hooks/useAuth";
import { useEffect } from "react";

const Login: React.FC = () => {
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      console.log("login");
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    await login(form.username.value, form.password.value);
  };

  return (
    <form
      className="mx-auto max-w-screen-lg space-y-2 rounded-lg p-4 pt-2"
      onSubmit={handleSubmit}
    >
      <input type="text" name="username" required />
      <input type="password" name="password" required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
