// eslint.config.cjs
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Enable Prettier's recommended rules
      'prettier/prettier': 'error',
    },
  },
];
