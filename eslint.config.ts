import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  {
    ignores: ["src/components/ui/**"], // Shadcn UI components are not linted
  },
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    plugins: { js, perfectionist: perfectionist, react, tailwindcss: tailwind },
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
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-jsx-props": "error",
    },
  },
  json.configs.recommended,
  markdown.configs.recommended,
  eslintConfigPrettier,
]);
