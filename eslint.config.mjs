// @ts-check
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'dist-server/**',
      'out-tsc/**',
      'coverage/**',
      '.angular/**',
      'tmp/**'
    ]
  },
  {
    files: ['**/*.ts'],
    extends: [
      tseslint.configs.base,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_'
        }
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public'
          }
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['PascalCase']
        }
      ],
      'brace-style': ['error', '1tbs'],
      'id-blacklist': 'off',
      'id-match': 'off',
      'no-underscore-dangle': 'off'
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended
    ],
    rules: {}
  }
);
