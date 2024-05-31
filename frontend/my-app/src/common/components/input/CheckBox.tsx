import style from "./CheckBox.module.css";

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  return <input {...props} type="checkbox" className={`${style.checkbox}`} />;
};

export default CheckBox;
