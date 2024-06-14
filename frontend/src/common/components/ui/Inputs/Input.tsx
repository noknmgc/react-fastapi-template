import { cn } from "@/common/utils/classname";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<BaseInputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={cn(
        "block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm",
        !props.disabled && "focus:outline-primary hover:border-primary",
      )}
    />
  );
};
