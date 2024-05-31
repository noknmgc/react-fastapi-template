import { useLayoutEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { getUsers } from "./api/getUsers";
import { deleteUser } from "./api/deleteUser";

import ConfirmModal, {
  ConfirmModalProps,
} from "../../common/components/modal/ConfirmModal";
import PrimaryButton from "../../common/components/button/PrimaryButton";
import SecondaryButton from "../../common/components/button/SecondaryButton";

import { User, UserResponse, Token } from "../../common/types";

interface AdminProps {
  user: User | null;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [modalProps, setModalProps] = useState<ConfirmModalProps>({
    isOpen: false,
    title: "Delete User",
    type: "warn",
    message: "Are you sure you want to delete the user?",
    confirm: () => {},
    cancel: () => {},
    buttonText: {
      confirm: "Delete",
      cancel: "Cancel",
    },
  });

  const navigate = useNavigate();

  useLayoutEffect(() => {
    const getNewTasks = async (token: Token) => {
      const newUsers = await getUsers(token);
      setUsers(newUsers);
    };

    if (user) {
      getNewTasks(user.token);
    }
  }, []);

  const handleDeleteUser = (userId: string) => {
    const modalClose = () => {
      setModalProps((prev) => {
        return { ...prev, isOpen: false };
      });
    };
    const confirm = async () => {
      if (!user) {
        modalClose();
        return;
      }

      await deleteUser(user.token, userId).catch((error) => {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;
        window.alert(
          status && detail ? `${status} : ${detail}` : "Something happened"
        );
        throw error;
      });
      const newUsers = await getUsers(user.token).catch((error) => {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;
        window.alert(
          status && detail ? `${status} : ${detail}` : "Something happened"
        );
        throw error;
      });
      setUsers(newUsers);
      modalClose();
    };

    const cancel = () => {
      modalClose();
    };

    setModalProps((prev) => {
      return {
        ...prev,
        isOpen: true,
        title: `Delete User : ${userId}`,
        confirm,
        cancel,
      };
    });
  };

  return (
    <>
      <ConfirmModal {...modalProps} />
      <div className="centered-box50">
        <h1 className="centered-text">admin</h1>
        <div className="grid-container centered-text">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            {users.map((member) => {
              return (
                <tbody key={member.id}>
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>
                      <Link to={`update/${member.id}`}>Edit</Link>
                    </td>
                    <td>
                      <SecondaryButton
                        onClick={() => {
                          handleDeleteUser(member.id);
                        }}
                      >
                        X
                      </SecondaryButton>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <div className="centered-text">
            <PrimaryButton
              onClick={() => {
                navigate("add");
              }}
            >
              add
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
