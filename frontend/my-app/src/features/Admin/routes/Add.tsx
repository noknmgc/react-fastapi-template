import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUser } from "../api/createUser";

import LabeledSelect from "../../../common/components/select/LabeledSelect";
import LabeledInput from "../../../common/components/input/LabeledInput";
import PrimaryButton from "../../../common/components/button/PrimaryButton";
import SecondaryButton from "../../../common/components/button/SecondaryButton";

import { UserRole, User } from "../../../common/types";
import { USER_ROLES } from "../../../common/constants";

interface AddProps {
  user: User | null;
}

const Add: React.FC<AddProps> = ({ user }) => {
  const [signinId, setSigninId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("User");

  const navigate = useNavigate();

  const handleChange = <T,>(setValue: (value: T) => void, newValue: T) => {
    setValue(newValue);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = USER_ROLES.find((role) => role === e.target.value);
    if (newRole) setRole(newRole);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (password !== confirmPassword) {
      window.alert("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    const requestBody = {
      id: signinId,
      password,
      name,
      role,
    };

    await createUser(user?.token, requestBody)
      .then(() => {
        navigate("/admin", { replace: true });
      })
      .catch((error) => {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;
        window.alert(
          status && detail ? `${status} : ${detail}` : "Something happened"
        );
      });
  };

  return (
    <div>
      <form className="centered-box50" onSubmit={handleSubmit}>
        <div className="grid-container">
          <LabeledInput
            label="id"
            type="text"
            name="username"
            required
            value={signinId}
            onChange={(e) => {
              handleChange(setSigninId, e.target.value);
            }}
          />

          <LabeledInput
            label="password"
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => {
              handleChange(setPassword, e.target.value);
            }}
          />

          <LabeledInput
            label="confirm password"
            type="password"
            name="confirm password"
            required
            value={confirmPassword}
            onChange={(e) => {
              handleChange(setConfirmPassword, e.target.value);
            }}
          />

          <LabeledInput
            label="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              handleChange(setName, e.target.value);
            }}
          />

          <LabeledSelect
            label="role"
            value={role}
            onChange={handleRoleChange}
            options={USER_ROLES.map((role) => {
              return { value: role, label: role };
            })}
          />

          <div className="flex-container">
            <PrimaryButton type="submit">Register</PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() => {
                navigate("/admin", { replace: true });
              }}
            >
              Cancel
            </SecondaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Add;
