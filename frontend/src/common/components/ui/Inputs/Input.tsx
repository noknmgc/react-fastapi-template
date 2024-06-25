import {
  Input as HeadlessInput,
  InputProps as HeadlessInputProps,
} from "@headlessui/react";
import { cn } from "@/common/utils/classname";

interface InputProps extends HeadlessInputProps {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <HeadlessInput
      {...props}
      className={cn(
        "block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm",
        !props.disabled && "hover:border-primary focus:outline-primary",
        className,
      )}
    />
  );
};
