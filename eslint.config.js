import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "coverage/**", "dist/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unreachable": "error",
      "no-duplicate-imports": "error",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
    },
  },
]);
