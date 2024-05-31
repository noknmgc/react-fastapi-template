import style from "./PrimaryButton.module.css";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PrimaryButton: React.FC<PrimaryButtonProps> = (props) => {
  const { className } = props;
  return <button {...props} className={`${style.primaryBtn} ${className}`} />;
};

export default PrimaryButton;
