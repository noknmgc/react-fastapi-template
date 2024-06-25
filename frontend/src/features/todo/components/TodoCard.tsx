import { cn } from "@/common/utils/classname";
import { TodoResponse } from "@/openapi";
import { useNavigate } from "react-router-dom";

interface TodoCardProps {
  todo: TodoResponse;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const navigate = useNavigate();
  return (
    <div
      onDoubleClick={() => {
        navigate(`/todos/${todo.id}`);
      }}
      className="block w-full rounded-lg border-2 border-primary p-2"
    >
      <div className="flex items-center justify-between">
        <h2 className={cn("text-xl font-bold", !todo.name && "text-slate-400")}>
          {todo.name || "名称なし"}
        </h2>
      </div>
    </div>
  );
};

export default TodoCard;
