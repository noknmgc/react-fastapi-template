import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Login from "@/features/auth/components/Login";
import ProtectedRoute from "./ProtectedRoute";
import Todos from "@/features/todo/components/Todos";
import Todo from "@/features/todo/components/Todo";
import Users from "@/features/user/components/Users";
import Forbidden from "./errors/Forbidden";
import NotFound from "./errors/NotFound";

export const AppRouter: React.FC = () => {
  return <RouterProvider router={createRouter()} />;
};

const createRouter = () =>
  createBrowserRouter([
    { path: "/", element: <Navigate to="todos" /> },
    { path: "/login", element: <Login /> },
    {
      path: "/",
      element: (
        <ProtectedRoute redirectLogin>
          <Outlet />
        </ProtectedRoute>
      ),
      children: [
        { path: "todos", element: <Todos /> },
        { path: "todos/:todoId", element: <Todo /> },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute validate={(user) => user.is_superuser}>
          <Outlet />
        </ProtectedRoute>
      ),
      children: [{ path: "users", element: <Users /> }],
    },
    { path: "/403", element: <Forbidden /> },
    { path: "/*", element: <NotFound /> },
  ]);
