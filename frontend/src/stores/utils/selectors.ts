import { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

/**
 * storeに自動的にセレクタを付与する関数。
 * 公式の案内：https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
 *
 * @param _store - zustandのstore
 * @returns セレクタが付与されたstore
 * @example
 * interface BearState {
 *   bears: number;
 *   increase: (by: number) => void;
 *   increment: () => void;
 * }
 *
 * const useBearStoreBase = create<BearState>()((set) => ({
 *   bears: 0,
 *   increase: (by) => set((state) => ({ bears: state.bears + by })),
 *   increment: () => set((state) => ({ bears: state.bears + 1 })),
 * }))
 *
 * const useBearStore = createSelectors(useBearStoreBase)
 *
 * // get the property
 * const bears = useBearStore.use.bears()
 * // get the action
 * const increment = useBearStore.use.increment()
 *
 */
const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export default createSelectors;
