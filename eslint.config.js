//@ts-check

import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier/flat";
import pugPlugin from "eslint-plugin-pug";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig(
  {
    extends: [
      js.configs.recommended,
      {
        languageOptions: {
          globals: globals.node,
        },
      },
      prettierConfig,
    ],
    files: ["**/*.js", "**/*.pug"],
  },
  {
    files: ["**/*.pug"],
    processor: pugPlugin.processors[".pug"],
  },
);
