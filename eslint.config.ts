import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser"; // 1. Обов'язково імпортуємо парсер для Vue

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"], // або 'flat/strongly-recommended'
  {
    files: ["**/*.vue"],
    languageOptions: {
      // 2. Головний парсер має бути саме для Vue компонентів
      parser: vueParser, 
      parserOptions: {
        // 3. А вже всередині скриптів Vue використовуємо TS парсер
        parser: tseslint.parser,
        sourceType: "module",
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  }
);
