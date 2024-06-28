import {
  Checkbox as HeadlessCheckbox,
  CheckboxProps as HeadlessCheckboxProps,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { cn } from "@/common/utils/classname";

interface CheckboxProps extends HeadlessCheckboxProps {
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => {
  return (
    <HeadlessCheckbox
      className={cn(
        "group block size-6 rounded-md p-1 ring-1 ring-inset ring-primary data-[checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckIcon className="hidden size-4 fill-white stroke-white stroke-1 group-data-[checked]:block" />
    </HeadlessCheckbox>
  );
};
