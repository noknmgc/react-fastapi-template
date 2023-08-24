import style from "./LabeledSelect.module.css";

interface LabeledSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

const LabeledSelect: React.FC<LabeledSelectProps> = (props) => {
  const { label, options } = props;
  return (
    <div>
      <label htmlFor={`${label}`} className={`${style.textLabel}`}>
        {label}
      </label>
      <select {...props} className={`${style.textSelect}`}>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LabeledSelect;
