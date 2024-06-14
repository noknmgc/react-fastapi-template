/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      theme: {
        colors: {
          primary: {
            light: "#5d92e3",
            DEFAULT: "#102C57",
            dark: "#051938",
          },
          accent: {
            light: "#ffe0e0",
            DEFAULT: "#FFB1B1",
            dark: "#cc7e7e",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
