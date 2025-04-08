import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import { globalIgnores } from "eslint/config";

export default [js.configs.recommended, ...eslintPluginAstro.configs.recommended, globalIgnores([".astro/*"])];
