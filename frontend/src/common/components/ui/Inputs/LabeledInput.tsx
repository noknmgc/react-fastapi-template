import { Field, Label } from "@headlessui/react";
import { Input, InputProps } from "./Input";

interface LabelInputProps extends InputProps {
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
