import { useEffect, useState } from "react";

/**
 * useDebounce - 値の変更を遅延させるカスタムフック
 *
 * @param {T} value - デバウンス対象の値
 * @param {number} delay - デバウンスの遅延時間（ミリ秒）
 * @returns {T} デバウンス後の値
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 */
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 後 debounce の対象 state をアップデート
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
