import { Button, LabeledInput } from "@/common/components/ui";
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
      <LabeledInput
        type="text"
        id="username"
        labelText="ユーザー名"
        name="username"
        required
      />
      <LabeledInput
        type="password"
        id="password"
        labelText="パスワード"
        name="password"
        required
      />
      <div className="flex justify-center">
        <Button type="submit">ログイン</Button>
      </div>
    </form>
  );
};

export default Login;
