//@ts-check

import js from "@eslint/js";
import pugPlugin from "eslint-plugin-pug";
import { defineConfig } from "eslint/config";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig(
  {
    extends: [
      js.configs.recommended,
      {
        languageOptions: {
          globals: globals.node,
        },
      },
    ],
    files: ["**/*.js", "**/*.pug"],
  },
  {
    files: ["**/*.pug"],
    processor: pugPlugin.processors[".pug"],
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": "off",
    },
  },
);
