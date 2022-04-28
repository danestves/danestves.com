// Dependencies
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

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
          light: "#071D49",
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
        body: {
          dark: "#B4B4B4",
          darker: "#292929",
          DEFAULT: "#595959",
        },
      },
      container: {
        center: true,
        padding: "1rem",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: "475px",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.body.DEFAULT"),
            "--tw-prose-headings": theme("colors.primary.light"),
            "--tw-prose-links": theme("colors.primary.light"),
            "--tw-prose-counters": theme("colors.body.DEFAULT"),
            "--tw-prose-pre-code": "var(--syntax-fg)",
            "--tw-prose-pre-bg": "var(--syntax-bg)",
            "--tw-prose-quote-borders": theme("colors.gray[300]"),
            "--tw-prose-quotes": theme("colors.gray[400]"),
            "h2, h3, h4, h5, h6": {
              "scroll-margin-top": theme("spacing[20]"),
              "& > a": {
                fontWeight: theme("fontWeight.bold"),
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline !important",
                },
              },
            },
            code: {
              borderRadius: theme("borderRadius.lg"),
              padding: `${defaultTheme.spacing[1]} ${defaultTheme.spacing[0.5]}`,
              fontWeight: theme("fontWeight.normal"),
            },
          },
        },
        dark: {
          css: {
            "--tw-prose-body": theme("colors.body.dark"),
            "--tw-prose-headings": theme("colors.primary[500]"),
            "--tw-prose-links": theme("colors.primary[500]"),
            "--tw-prose-bold": theme("colors.gray[300]"),
            "--tw-prose-counters": theme("colors.body.dark"),
            "--tw-prose-quote-borders": theme("colors.gray[500]"),
            "--tw-prose-quotes": theme("colors.gray[400]"),
          },
        },
      }),
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".horizontal-tb": {
          writingMode: "horizontal-tb",
        },
        ".vertical-rl": {
          writingMode: "vertical-rl",
        },
        ".vertical-lr": {
          writingMode: "vertical-lr",
        },
      };
      addUtilities(newUtilities);
    }),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
