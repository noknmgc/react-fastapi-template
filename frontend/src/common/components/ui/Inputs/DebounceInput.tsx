import { useEffect, useState } from "react";
import { Input, InputProps } from "./Input";
import { useDebounce } from "@/common/hooks/useDebounce";

interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onDebounceChange: (value: string) => void;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onDebounceChange,
  ...props
}) => {
  const [text, setText] = useState(value);
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (value !== text) onDebounceChange(debouncedText);
  }, [debouncedText]);

  return (
    <Input {...props} value={text} onChange={(e) => setText(e.target.value)} />
  );
};
