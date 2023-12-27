export const tabTheme = {
  tablist: {
    tabitem: {
      base: "flex items-center justify-center p-2 px-3 text-xs text-main uppercase font-bold disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 border-r-2 border-default last:border-none",
      styles: {
        default: {
          base: "rounded-none",
          active: {
            on: "text-secondary",
            off: "",
          },
        },
      },
    },
  },
  tabpanel: "w-full overflow-x-auto rounded-md",
};
