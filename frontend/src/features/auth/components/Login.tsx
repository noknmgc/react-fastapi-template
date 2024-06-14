import { Button } from "@/common/components/ui/Buttons";
import { Input } from "@/common/components/ui/Inputs";
import { useAuth } from "@/common/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Login: React.FC = () => {
  const { login, isLoggedIn } = useAuth();
  const { redirectTo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (redirectTo) navigate(redirectTo);
      else navigate("/todos");
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    await login(form.username.value, form.password.value);
    if (redirectTo) navigate(redirectTo);
    else navigate("/todos");
  };

  return (
    <form
      className="mx-auto max-w-screen-md space-y-4 rounded-lg p-4 pt-2"
      onSubmit={handleSubmit}
    >
      <Input type="text" name="username" required />
      <Input type="password" name="password" required />
      <Button type="submit">Submit</Button>
      <Button buttonStyle="secondary" type="submit">
        Submit
      </Button>
      <Button buttonStyle="tertiary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default Login;
