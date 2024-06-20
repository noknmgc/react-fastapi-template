import { cn } from "@/common/utils/classname";
import { TodoResponse } from "@/openapi";
import { Link } from "react-router-dom";

interface TodoCardProps {
  todo: TodoResponse;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  return (
    <Link
      to={`/todos/${todo.id}`}
      className="block max-w-sm rounded-lg border-2 border-primary p-6 hover:bg-primary-light"
    >
      <h2 className={cn("text-xl font-bold", !todo.name && "text-slate-400")}>
        {todo.name || "名称なし"}
      </h2>
    </Link>
  );
};

export default TodoCard;
