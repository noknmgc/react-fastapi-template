import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { UserResponse } from "@/openapi";
import { useUsers } from "../api/useUsers";
import { Button } from "@/common/components/ui";

const Users: React.FC = () => {
  const { data: users } = useUsers();
  const columns: { value: keyof UserResponse; label: string }[] = [
    { value: "id", label: "ID" },
    { value: "username", label: "名前" },
    { value: "is_superuser", label: "管理者" },
  ];

  const getColumnValue = (user: UserResponse, key: keyof UserResponse) => {
    if (key === "is_superuser") return user[key] ? "Yes" : "";
    return user[key];
  };

  return (
    <>
      <h1 className="mb-6 text-xl font-bold">ユーザーリスト</h1>
      <div className="relative overflow-x-auto rounded-t-md">
        <table className="w-full text-left text-base">
          <thead className="whitespace-nowrap bg-primary text-sm text-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.value} scope="col" className="px-6 py-3">
                  {col.label}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr
                  key={user.id}
                  className="border-b border-primary even:bg-slate-200"
                >
                  {columns.map((col) => (
                    <td key={`${user.id} ${col.value}`} className="px-6 py-3">
                      {getColumnValue(user, col.value)}
                    </td>
                  ))}
                  <td className="flex items-center space-x-6 px-6 py-3">
                    <Button buttonStyle="tertiary" className="p-2">
                      <PencilSquareIcon className="size-6 stroke-current" />
                    </Button>
                    <Button buttonStyle="tertiary" className="p-2">
                      <TrashIcon className="size-6 stroke-current" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
