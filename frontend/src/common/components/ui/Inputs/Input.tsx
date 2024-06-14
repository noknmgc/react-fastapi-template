import { cn } from "@/common/utils/classname";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<BaseInputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={cn(
        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900",
        !props.disabled && "focus:outline-primary hover:border-gray-400",
      )}
    />
  );
};
