import styles from "./TextInput.module.css";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = (props) => {
  const { className } = props;
  return <input {...props} className={`${styles.textInput} ${className}`} />;
};

export default TextInput;
