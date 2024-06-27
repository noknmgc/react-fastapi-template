import { cn } from "@/common/utils/classname";
import { Spinner } from "./Spinner";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  spinnerClassName?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  spinnerClassName,
  className,
}) => {
  return (
    <div className={cn("flex justify-center", className)}>
      <Spinner
        className={cn(
          size === "sm" && "size-8",
          size === "md" && "size-16",
          size === "lg" && "size-32",
          spinnerClassName,
        )}
      />
    </div>
  );
};
