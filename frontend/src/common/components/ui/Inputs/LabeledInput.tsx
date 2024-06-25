import { Field, Label } from "@headlessui/react";
import { Input } from "./Input";

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

export const LabeledInput: React.FC<LabelInputProps> = ({
  labelText,
  ...props
}) => {
  return (
    <Field>
      {labelText && (
        <Label className="mb-2 block text-sm font-medium">{labelText}</Label>
      )}
      <Input {...props} />
    </Field>
  );
};
