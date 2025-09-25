import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import react from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    plugins: { js, react, tailwindcss: tailwind },
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
        chrome: "readonly",
        __APP_VERSION__: "readonly",
        __APP_NAME__: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "detect" },
      tailwindcss: { config: "./tailwind.config.js" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
    },
  },
  json.configs.recommended,
  markdown.configs.recommended,
  eslintConfigPrettier,
]);
