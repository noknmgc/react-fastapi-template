import {
  Button as HeadlessButton,
  ButtonProps as HeadlessButtonProps,
} from "@headlessui/react";
import { cn } from "@/common/utils/classname";

interface ButtonProps extends HeadlessButtonProps {
  className?: string;
  buttonStyle?: "primary" | "secondary" | "tertiary";
}

export const Button: React.FC<ButtonProps> = ({
  buttonStyle = "primary",
  className,
  ...props
}) => {
  return (
    <HeadlessButton
      {...props}
      className={cn(
        "rounded-lg px-5 py-2.5 text-center text-sm font-medium focus:outline-none",
        buttonStyle === "primary" &&
          "bg-primary text-slate-50 hover:bg-primary-dark focus:ring-4 focus:ring-primary-light",
        buttonStyle === "secondary" &&
          "border-2 border-primary bg-slate-50 text-primary hover:bg-primary-light focus:ring-4 focus:ring-primary-light",
        buttonStyle === "tertiary" && "text-primary hover:bg-primary-light",
        props.disabled && "cursor-not-allowed",
        className,
      )}
    />
  );
};
