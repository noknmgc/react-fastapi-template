import { useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/common/api/clients";
import { myselfQueryOptions } from "@/common/api/useMyself";

const Login: React.FC = () => {
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    await authApi.loginCookie(form.username.value, form.password.value);
    // myselfのキャッシュを無効化し、再検証させる
    queryClient.invalidateQueries({ queryKey: myselfQueryOptions.queryKey });
  };

  return (
    <form
      className="mx-auto max-w-screen-lg rounded-lg space-y-2"
      onSubmit={handleSubmit}
    >
      <input type="text" name="username" required />
      <input type="password" name="password" required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
