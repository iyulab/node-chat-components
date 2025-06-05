import { defineConfig } from "eslint/config";
import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import liteslint from "eslint-plugin-lit";
import globals from "globals";

export default defineConfig([
  { 
    files: ["src/**/*.{js,mjs,cjs,ts}"], 
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: { 
      sourceType: "module",
      globals: globals.browser 
    },
    plugins: { 
      js: jseslint,
      ts: tseslint,
      lit: liteslint
    },
    extends: [
      "js/recommended",
      "ts/recommended",
      "lit/flat/recommended"
    ], 
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  }
]);
