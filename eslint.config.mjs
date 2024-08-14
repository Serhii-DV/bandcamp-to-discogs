import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'webpack.config.js']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions
      }
    }
  },
  {
    files: ['src/**.js', 'src/**.ts'],
    rules: {
      'no-unused-vars': 'error',
      semi: 'error'
    }
  }
];
