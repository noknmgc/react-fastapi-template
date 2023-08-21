import style from "./SecondaryButton.module.css";

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SecondaryButton: React.FC<SecondaryButtonProps> = (props) => {
  const { className } = props;
  return <button {...props} className={`${style.secondaryBtn} ${className}`} />;
};

export default SecondaryButton;
