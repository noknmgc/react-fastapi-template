import { cn } from "@/common/utils/classname";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle?: "primary" | "secondary" | "tertiary";
}

export const Button: React.FC<ButtonProps> = ({
  buttonStyle = "primary",
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "rounded-lg px-5 py-2.5 text-center text-sm font-medium focus:outline-none",
        buttonStyle === "primary" &&
          "bg-primary hover:bg-primary-dark focus:ring-primary-light text-slate-50 focus:ring-4",
        buttonStyle === "secondary" &&
          "border-primary text-primary hover:bg-primary-light focus:ring-primary-light border-2 bg-slate-50 focus:ring-4",
        buttonStyle === "tertiary" && "text-primary hover:bg-primary-light",
        props.disabled && "cursor-not-allowed",
        className,
      )}
    />
  );
};
