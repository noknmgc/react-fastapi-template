import TextInput from "./TextInput";

import style from "./LabeledInput.module.css";

interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const LabeledInput: React.FC<LabeledInputProps> = (props) => {
  const { label } = props;
  return (
    <div>
      <label htmlFor={`${label}`} className={`${style.textLabel}`}>
        {label}{" "}
        {props.required ? <span style={{ color: "red" }}>*</span> : <></>}
      </label>
      <TextInput {...props} id={`${label}`} />
    </div>
  );
};

export default LabeledInput;
