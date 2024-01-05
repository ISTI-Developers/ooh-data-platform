/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        "fade-fr-t": "fade-fr-t 750ms ease-in-out",
        fade: "fade 300ms ease-in-out",
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-fr-t": {
          "0%": {
            opacity: 0,
            transform: "translate(-50%,-100%)",
          },
          "50%": {
            opacity: 0,
            transform: "translate(-50%,-100%)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,0)",
          },
        },
      },
      colors: {
        main: "#243444",
        secondary: "#0692da",
        "secondary-hover": "#0474ae",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
