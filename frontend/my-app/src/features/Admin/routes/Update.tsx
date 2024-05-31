import { useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getUser } from "../api/getUser";
import { updateUser } from "../api/updateUser";

import LabeledInput from "../../../common/components/input/LabeledInput";
import PrimaryButton from "../../../common/components/button/PrimaryButton";
import SecondaryButton from "../../../common/components/button/SecondaryButton";
import CheckBox from "../../../common/components/input/CheckBox";

import { User, Token } from "../../../common/types";

interface UpdateProps {
  user: User | null;
}

const Update: React.FC<UpdateProps> = ({ user }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [signinId, setSigninId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [editPassword, setEditPassword] = useState(false);

  useLayoutEffect(() => {
    const getNewEditUser = async (token: Token) => {
      const newEditUser = await getUser(token, userId ?? "");
      setSigninId(newEditUser.id);
      setName(newEditUser.name);
    };

    if (user) getNewEditUser(user.token);
  }, []);

  const handleChange = <T,>(setValue: (value: T) => void, newValue: T) => {
    setValue(newValue);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!user) return;
    if (editPassword && password !== confirmPassword) {
      window.alert("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    const requestBody = {
      id: signinId,
      password: editPassword ? password : undefined,
      name,
    };

    updateUser(user.token, userId ?? "", requestBody)
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
      <h2 className="centered-text">Update : {userId}</h2>
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
              label="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                handleChange(setName, e.target.value);
              }}
            />

            <div className="flex-container">
              <span>パスワードを変更する：</span>
              <CheckBox
                checked={editPassword}
                onChange={(e) => {
                  setEditPassword((prev) => !prev);
                }}
              />
            </div>

            {editPassword && (
              <>
                <LabeledInput
                  label="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    handleChange(setPassword, e.target.value);
                  }}
                />

                <LabeledInput
                  label="confirm password"
                  type="password"
                  name="confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    handleChange(setConfirmPassword, e.target.value);
                  }}
                />
              </>
            )}

            <div className="flex-container">
              <PrimaryButton type="submit">Update</PrimaryButton>

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
    </div>
  );
};

export default Update;
