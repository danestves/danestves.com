// Dependencies
const defaultConfig = require("tailwindcss/defaultConfig");

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E9F6FC",
          100: "#D2EDF9",
          200: "#AADDF3",
          300: "#7DCCED",
          400: "#54BCE8",
          500: "#29ABE2",
          600: "#1A8CBD",
          700: "#13678B",
          800: "#0D465E",
          900: "#06212D",
          DEFAULT: "#29ABE2",
        },
        secondary: {
          50: "#E0FFF6",
          100: "#C2FFED",
          200: "#80FFD9",
          300: "#42FFC6",
          400: "#05FFB4",
          500: "#00C389",
          600: "#009E6F",
          700: "#007552",
          800: "#004D36",
          900: "#00291D",
          DEFAULT: "#00C389",
        },
      },
      container: {
        center: true,
        padding: "1rem",
      },
      fontFamily: {
        sans: ["Inter", ...defaultConfig.theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
