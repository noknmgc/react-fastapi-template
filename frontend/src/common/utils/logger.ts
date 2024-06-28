import storage from "./storage";

/** ログレベルの型 */
type LogLevel = "info" | "warn" | "error";

/** 使用するログレベル */
const LOG_LEVEL: LogLevel = "info";
const LOG_SIZE: number = 10;

/** Log関数の型 */
interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

/** loggerの型。consoleと同じ使い方ができる定義にしている。 */
interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

/** コンソールとlocalStorageにログを出力・保存するクラス */
class ConsoleLogger implements Logger {
  /** 保持するログの上限数 */
  storeSize: number;
  /** infoレベルのログ関数 */
  readonly log: LogFn;
  /** warnレベルのログ関数 */
  readonly warn: LogFn;
  /** errorレベルのログ関数 */
  readonly error: LogFn;

  constructor(level: LogLevel, size: number) {
    this.storeSize = size;

    const logFn = import.meta.env.DEV
      ? (level: LogLevel, message?: any, ...optionalParams: any[]) => {
          console[level](message, ...optionalParams);
          this.store(level, [message, ...optionalParams]);
        }
      : (level: LogLevel, message?: any, ...optionalParams: any[]) => {
          this.store(level, [message, ...optionalParams]);
        };

    /** errorレベルのログ関数 */
    const handleError: LogFn = (message, ...optionalParams) => {
      logFn("error", message, ...optionalParams);
    };
    /** warnレベルのログ関数 */
    const handleWarn: LogFn = (message, ...optionalParams) => {
      logFn("warn", message, ...optionalParams);
    };
    /** infoレベルのログ関数 */
    const handleLog: LogFn = (message, ...optionalParams) => {
      logFn("info", message, ...optionalParams);
    };

    // コンストラクタに渡されたlevelによって出力するものを変える。
    switch (level) {
      case "error":
        this.error = handleError;
        this.warn = () => {};
        this.log = () => {};
        break;
      case "warn":
        this.error = handleError;
        this.warn = handleWarn;
        this.log = () => {};
        break;
      case "info":
      default:
        this.error = handleError;
        this.warn = handleWarn;
        this.log = handleLog;
        break;
    }
  }

  private store(level: LogLevel, data: any[]) {
    const logMessage = this.formatLogMessage(level, data);
    const logKey = this.getLogKey();
    const logKeyArray = storage.getLogKeyArray();

    if (!logKeyArray.includes(logKey)) {
      // logKeyArrayにlogKeyが無い場合、logKeyを登録する。
      if (logKeyArray.length >= this.storeSize) {
        // logKeyArrayのサイズが上限以上だった場合、一番古い物を削除する。
        const oldestLogKey = logKeyArray.shift();
        if (oldestLogKey !== undefined) storage.clearLog(oldestLogKey);
      }
      logKeyArray.push(logKey);
      storage.setLogKeyArray(logKeyArray);
    }

    // ログを追加
    storage.addLog(logKey, logMessage);
  }

  /**
   * ログメッセージのフォーマット関数
   * @param level ログレベル
   * @param data ログに表示するのデータ
   * @returns ログメッセージ
   * @example
   * ```ts
   * // returns "2024/05/20 13:44:02.035 INFO : request for /data"
   * this.formatLogMessage("info", ["request for /data"])
   * ```
   */
  private formatLogMessage(level: LogLevel, data: any[]) {
    const dataString: string = data.map((d) => JSON.stringify(d)).join(", ");
    const date = this.getDatetime();
    const lv = `[${level.toUpperCase()}]`;
    return `${date} ${lv} : ${dataString}`;
  }

  /**
   * 今日の日付をYYYY/MM/DD HH:MM:SS.fffの形式にフォーマットする関数
   * @returns フォーマットした今日の日付
   * @example
   * ```ts
   * // returns "2024/05/20 13:44:02.035"
   * this.getDatetime()
   * ```
   */
  private getDatetime() {
    const date = new Date();
    return (
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getDate().toString().padStart(2, "0") +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      ":" +
      date.getSeconds().toString().padStart(2, "0") +
      "." +
      date.getMilliseconds().toString().padStart(3, "0")
    );
  }

  /**
   * ログKeyを返す関数
   * @returns ログKEY
   * @example
   * ```ts
   * // returns "Log_2024-05-20"
   * this.getDate()
   * ```
   */
  private getLogKey() {
    const date = new Date();
    return (
      "Log_" +
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  }
}

export const logger = new ConsoleLogger(LOG_LEVEL, LOG_SIZE);
