import { Navigate, useLocation } from "react-router-dom";
import { UserResponse } from "@/openapi";
import { useAuth } from "@/common/hooks/useAuth";

interface Props {
  validate?: (user: UserResponse) => boolean;
  redirectLogin?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({
  validate = () => true,
  redirectLogin = false,
  children,
}) => {
  const { user, isLoading } = useAuth();
  console.log("protected", user);
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (user === undefined || !validate(user))
    return (
      <Navigate
        to={
          redirectLogin
            ? `/login?redirectTo=${encodeURIComponent(location.pathname)}`
            : `/403`
        }
        replace
      />
    );
  return children;
};

export default ProtectedRoute;