import style from "./DestructiveButton.module.css";

interface DestructiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DestructiveButton: React.FC<DestructiveButtonProps> = (props) => {
  const { className } = props;
  return (
    <button {...props} className={`${style.destructiveBtn} ${className}`} />
  );
};

export default DestructiveButton;
