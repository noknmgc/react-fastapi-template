import { ClassNameValue, extendTailwindMerge, twJoin } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      colors: [
        {
          primary: ["light", "DEFAULT", "dark"],
          accent: ["light", "DEFAULT", "dark"],
        },
      ],
    },
  },
});

export const cn = (...classLists: ClassNameValue[]) => {
  return twMerge(twJoin(...classLists));
};
