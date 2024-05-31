import DestructiveButton from "../button/DestructiveButton";
import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";

import style from "./ConfirmModal.module.css";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "warn";
  confirm: () => void;
  cancel: () => void;
  buttonText?: {
    confirm?: string;
    cancel?: string;
  };
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  type,
  confirm,
  cancel,
  buttonText,
}) => {
  let ConfirmButton;
  switch (type) {
    case "info":
      ConfirmButton = PrimaryButton;
      break;
    case "warn":
      ConfirmButton = DestructiveButton;
      break;
    default:
      throw Error("Unknown confirm modal type");
  }
  return isOpen ? (
    <div className={`${style.overlay}`}>
      <div className={`${style.content}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="flex-container">
          <ConfirmButton onClick={confirm}>
            {buttonText?.confirm ? buttonText.confirm : "Confirm"}
          </ConfirmButton>
          <SecondaryButton onClick={cancel}>
            {buttonText?.cancel ? buttonText.cancel : "Cancel"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ConfirmModal;
