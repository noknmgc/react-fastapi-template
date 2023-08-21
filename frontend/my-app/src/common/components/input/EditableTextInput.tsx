import { useState } from "react";

import TextInput from "./TextInput";

import style from "./EditableTextInput.module.css";

interface EditableTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const EditableTextInput: React.FC<EditableTextInputProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const { onBlur, onKeyDown, value } = props;

  const handleChangeEditMode = () => {
    setEditing((prev) => !prev);
  };

  return (
    <>
      {editing ? (
        <TextInput
          {...props}
          onBlur={(e) => {
            if (onBlur) {
              onBlur(e);
            }
            handleChangeEditMode();
          }}
          onKeyDown={(e) => {
            if (onKeyDown) {
              onKeyDown(e);
            }
            if (e.key === "Enter") {
              handleChangeEditMode();
            }
          }}
          type="text"
        />
      ) : (
        <button
          className={`${style.textButton}`}
          onClick={() => {
            handleChangeEditMode();
          }}
        >
          {value}
        </button>
      )}
    </>
  );
};

export default EditableTextInput;
