import js from '@eslint/js';
import globals from 'globals';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';


export default [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json'
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            jest: jestPlugin
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            'no-console': 'warn',
            'prefer-const': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' , varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            eqeqeq: ['warn', 'always'],
            'no-var': 'error',
            'max-params': ['warn', { max: 4 }],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            'no-empty-function': 'warn',
            'no-duplicate-imports': 'warn',
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-be': 'warn',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
        }
    },
];