import { StateCreator, StoreMutatorIdentifier } from "zustand";

import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * 全てのストアに適用するミドルウェアで使用しているMutators
 */
type Mutators = [["zustand/devtools", never], ["zustand/immer", never]];

/**
 * 全てのストアに適用するミドルウェアの型
 * 型の参考 https://github.com/pmndrs/zustand/issues/1242
 */
type DefaultMiddlewares = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, [...Mps, ...Mutators], Mcs>,
  options?: {
    storeName?: string;
  },
) => StateCreator<T, Mps, [...Mutators, ...Mcs]>;

/** 全てのストアに適用するミドルウェア */
const middlewares: DefaultMiddlewares = (f, options) => {
  return devtools(immer(f), {
    name: "zustand-store",
    store: options?.storeName ?? undefined,
    enabled: import.meta.env.DEV,
  });
};

export default middlewares;
