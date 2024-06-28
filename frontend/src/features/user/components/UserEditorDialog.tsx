import { useState } from "react";
import { DialogPanel, DialogTitle } from "@headlessui/react";

import { UserResponse } from "@/openapi";
import { Button, Checkbox, LabeledInput, Select } from "@/common/components/ui";
import { useUpdateUser } from "../api/updateUser";

interface UserEditorDialogProps {
  user: UserResponse;
  close: () => void;
}

const UserEditorDialog: React.FC<UserEditorDialogProps> = ({ user, close }) => {
  const { mutate: updateUser } = useUpdateUser();

  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(user.is_superuser ? "superuser" : "common");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    // パスワードの確認
    if (isPasswordChange) {
      if (password !== confirmPassword) {
        setPassword("");
        setConfirmPassword("");
        setErrors((prev) => [
          ...prev,
          "入力されたパスワードが違います。入力しなおしてください。",
        ]);
        return;
      }
    }
    updateUser({
      username: user.username,
      userUpdate: {
        password: isPasswordChange ? password : undefined,
        is_superuser: role === "superuser",
      },
    });
    close();
  };

  return (
    <DialogPanel className="w-[32rem] max-w-lg rounded-lg bg-white px-10 py-6 shadow-lg">
      <DialogTitle className="mb-2 text-xl font-bold">
        {user.username} 編集
      </DialogTitle>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isPasswordChange}
            onChange={() => {
              setIsPasswordChange((prev) => !prev);
            }}
          />
          <span>パスワードを変更する</span>
        </div>
        {isPasswordChange && (
          <>
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
          </>
        )}
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
            {errors.map((err) => (
              <span key={err}>
                {err}
                <br />
              </span>
            ))}
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

export default UserEditorDialog;
