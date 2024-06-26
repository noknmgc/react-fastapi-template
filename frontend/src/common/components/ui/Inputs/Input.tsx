import {
  Input as HeadlessInput,
  InputProps as HeadlessInputProps,
} from "@headlessui/react";
import { cn } from "@/common/utils/classname";

export interface InputProps extends HeadlessInputProps {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <HeadlessInput
      {...props}
      className={cn(
        "block w-full rounded-lg bg-white p-2.5 text-sm",
        !props.disabled &&
          "border border-slate-300 hover:border-primary focus:outline-primary",
        className,
      )}
    />
  );
};
