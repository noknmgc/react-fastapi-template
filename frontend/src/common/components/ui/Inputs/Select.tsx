import {
  Select as HeadlessSelect,
  SelectProps as HeadlessSelectProps,
} from "@headlessui/react";
import { cn } from "@/common/utils/classname";

interface SelectProps extends HeadlessSelectProps {
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ className, ...props }) => {
  return (
    <HeadlessSelect
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
