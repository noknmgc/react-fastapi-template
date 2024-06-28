import { useMemo, useState } from "react";
import { DialogPanel, DialogTitle } from "@headlessui/react";

import { Button, LabeledInput, Select } from "@/common/components/ui";
import { useCreateUser } from "../api/createUser";
import { useUsers } from "../api/useUsers";

interface UserCreateDialogProps {
  close: () => void;
}

const UserCreateDialog: React.FC<UserCreateDialogProps> = ({ close }) => {
  const { data: users } = useUsers();
  const { mutate: createUser } = useCreateUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("common");
  const [errors, setErrors] = useState<string[]>([]);

  const usernames = useMemo(() => users.map((user) => user.username), [users]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // ユーザー名の確認
    if (usernames.includes(username)) {
      newErrors.push("すでに存在しているユーザー名です。");
    }

    // パスワードの確認
    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      newErrors.push("入力されたパスワードが違います。");
    }
    setErrors(newErrors);
    if (newErrors.length > 0) return;

    createUser({ username, password, is_superuser: role === "superuser" });
    close();
  };

  return (
    <DialogPanel className="w-[32rem] max-w-lg rounded-lg bg-white px-10 py-6 shadow-lg">
      <DialogTitle className="mb-2 text-xl font-bold">
        新規ユーザー作成
      </DialogTitle>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <LabeledInput
          labelText="ユーザー名"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />
        <LabeledInput
          labelText="パスワード"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <LabeledInput
          labelText="パスワード(再入力)"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          required
        />
        <Select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option value="common">一般ユーザー</option>
          <option value="superuser">管理者</option>
        </Select>

        {errors.length > 0 && (
          <div
            className="rounded-lg bg-red-50 p-4 text-sm text-warn-dark"
            role="alert"
          >
            <ul>
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-6">
          <Button type="button" buttonStyle="secondary" onClick={close}>
            キャンセル
          </Button>
          <Button type="submit" buttonStyle="primary">
            適用
          </Button>
        </div>
      </form>
    </DialogPanel>
  );
};

export default UserCreateDialog;
