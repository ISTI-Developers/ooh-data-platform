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

export const datePickerTheme = {
  popup: {
    footer: {
      button: {
        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300",
        today:
          "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600",
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          selected: "bg-blue-500 text-white hover:bg-blue-400",
        },
      },
    },
  },
};
