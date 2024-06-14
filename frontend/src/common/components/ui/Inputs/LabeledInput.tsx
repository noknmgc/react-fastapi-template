import { Input } from "./Input";

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

export const LabeledInput: React.FC<LabelInputProps> = ({
  labelText,
  id,
  ...props
}) => {
  return (
    <div>
      {labelText && (
        <label className="mb-2 block text-sm font-medium" htmlFor={id}>
          {labelText}
        </label>
      )}
      <Input id={id} {...props} />
    </div>
  );
};
