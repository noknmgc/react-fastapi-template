import { create } from "zustand";
import middlewares from "./utils/middlewares";
import createSelectors from "./utils/selectors";

interface DialogContent {
  /** ダイアログの種類 */
  type: "confirm" | "notice" | "custom";
  /** ダイアログに表示するタイトル */
  title: string;
  /** ダイアログに表示する説明 */
  description: string;
  /** ダイアログを閉じた時の処理 */
  onClose?: () => void | Promise<void>;
}

interface ConfirmContent extends DialogContent {
  type: "confirm";
  /** 破壊的変更があるか否か */
  isWarning?: boolean;
  /** 承認した時の処理 */
  onConfirm: () => void | Promise<void>;
  /** テキストの変更 */
  customText?: {
    /** 承認ボタンのテキスト */
    confirm?: string;
    /** キャンセルボタンのテキスト */
    close?: string;
  };
}

interface NoticeContent extends DialogContent {
  type: "notice";
  /** テキストの変更 */
  customText?: {
    /** 閉じるボタンのテキスト */
    close?: string;
  };
}

interface CustomContent {
  type: "custom";
  /** ダイアログの中身の関数コンポーネント */
  Panel: React.FC<any>;
  /** Panelに渡すpropsのうち、closeを除いたもの */
  panelProps: Omit<any, "close">;
}

interface DialogState {
  /** ダイアログの開閉状態 */
  isOpen: boolean;
  /** ダイアログの中身 */
  content: ConfirmContent | NoticeContent | CustomContent;
}

interface DialogStateWithAction extends DialogState {
  /** ダイアログを閉じる */
  closeDialog: () => void;
  /** confirmダイアログを開く */
  openConfirmDialog: (content: Omit<ConfirmContent, "type">) => void;
  /** noticeダイアログを開く */
  openNoticeDialog: (content: Omit<NoticeContent, "type">) => void;
  /** customダイアログを開く */
  openCustomDialog: (content: Omit<CustomContent, "type">) => void;
}

const initialState: DialogState = {
  isOpen: false,
  content: { title: "", description: "", type: "notice", onClose: () => {} },
};

const useDialogBase = create<DialogStateWithAction>()(
  middlewares(
    (set) => ({
      ...initialState,
      closeDialog: () =>
        set((state) => {
          state.isOpen = false;
        }),
      openConfirmDialog: ({
        title,
        description,
        isWarning = false,
        onConfirm,
        onClose = () => {},
        customText: { confirm = "OK", close = "キャンセル" } = {},
      }) =>
        set((state) => {
          state.isOpen = true;
          state.content = {
            type: "confirm",
            title,
            description,
            isWarning,
            onConfirm,
            onClose,
            customText: { confirm, close },
          };
        }),
      openNoticeDialog: ({
        title,
        description,
        onClose = () => {},
        customText: { close = "閉じる" } = {},
      }) =>
        set((state) => {
          state.isOpen = true;
          state.content = {
            type: "notice",
            title,
            description,
            onClose,
            customText: { close },
          };
        }),
      openCustomDialog: (content) =>
        set((state) => {
          state.isOpen = true;
          state.content = {
            type: "custom",
            ...content,
          };
        }),
    }),
    { storeName: "dialog" },
  ),
);

export const useDialogStore = createSelectors(useDialogBase);
