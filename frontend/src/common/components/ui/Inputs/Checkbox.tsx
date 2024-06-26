import {
  Checkbox as HeadlessCheckbox,
  CheckboxProps as HeadlessCheckboxProps,
} from "@headlessui/react";
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="hidden size-4 fill-white stroke-white stroke-1 group-data-[checked]:block"
      >
        <path
          fillRule="evenodd"
          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
          clipRule="evenodd"
        />
      </svg>
    </HeadlessCheckbox>
  );
};
