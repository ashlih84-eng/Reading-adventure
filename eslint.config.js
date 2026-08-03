import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  {ignores:['dist','node_modules']},
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {files:['**/*.{ts,tsx}'],languageOptions:{globals:{...globals.browser}},rules:{'react-hooks/exhaustive-deps':'off'}},
  {files:['public/sw.js'],languageOptions:{globals:{...globals.serviceworker}}},
  {files:['worker/**/*.js'],languageOptions:{globals:{...globals.serviceworker}}},
  {files:['scripts/**/*.mjs'],languageOptions:{globals:{...globals.node}}},
);
