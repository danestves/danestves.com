import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import perfectionist from "eslint-plugin-perfectionist";
import { globalIgnores } from "eslint/config";

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  globalIgnores([".astro/*"]),
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-jsx-props": "warn",
    },
  },
];
