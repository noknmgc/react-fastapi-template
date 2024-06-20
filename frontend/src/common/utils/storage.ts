const LOG_ARRAY_KEY = "log_management_array";

const storage = {
  /**
   * ログKEY配列を日付順に返す関数。
   * @returns ログKEY配列
   */
  getLogKeyArray: (): string[] => {
    const logKeyArray = JSON.parse(
      window.localStorage.getItem(LOG_ARRAY_KEY) ?? "[]",
    ) as string[];
    return logKeyArray.sort();
  },
  /**
   * ログKEY配列を置き換える関数
   * @param logKeyArray 置き換えるログKEY配列
   */
  setLogKeyArray: (logKeyArray: string[]) => {
    window.localStorage.setItem(LOG_ARRAY_KEY, JSON.stringify(logKeyArray));
  },
  /**
   * ログKEY配列を削除する関数
   */
  clearLogKeyArray: () => {
    window.localStorage.removeItem(LOG_ARRAY_KEY);
  },
  /**
   * ログkeyに対応するログを返す関数。
   * ログkeyが登録されていなければ、nullを返す
   * @param key ログKEY
   * @returns ログ
   */
  getLog: (key: string): string | null => {
    return window.localStorage.getItem(key);
  },
  /**
   * 登録されている全てのログを返す関数
   * @returns 全てのログ
   */
  getAllLog: (): string[] => {
    const logKeyArray = storage.getLogKeyArray();
    return logKeyArray.map((key) => storage.getLog(key) ?? "");
  },
  /**
   * 登録されている全てのログを返すダウンロードする関数
   * @param filename ダウンロードするファイルの名前
   */
  downloadAllLog: (filename: string = "client.log") => {
    const logs = storage.getAllLog();
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const errorTextBlob = new Blob([bom, logs.join("\n")], {
      type: "text/plain",
    });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(errorTextBlob);
    a.download = filename;
    a.click();
    a.remove();
  },
  /**
   * ログkeyに新しくログを登録する関数(上書き)
   * @param key ログKEY
   * @param log 置き換えるログ
   */
  setLog: (key: string, log: string) => {
    window.localStorage.setItem(key, log);
  },
  /**
   * ログKEYにログを追加する関数。
   * 改行区切りで追加する。
   * @param key ログKEY
   * @param log 追加するログ
   */
  addLog: (key: string, log: string) => {
    const currentLog = storage.getLog(key) ?? "";
    window.localStorage.setItem(key, currentLog + "\n" + log);
  },
  /**
   * ログKEYのログを削除する関数。
   * @param key ログKEY
   */
  clearLog: (key: string) => {
    window.localStorage.removeItem(key);
  },
};

export default storage;
