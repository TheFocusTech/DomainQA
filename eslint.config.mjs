import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            '**/README.md',
            '**/package-lock.json',
            '**/package.json',
            '**/*.yml',
            '**/*.html',
            '**/node_modules/',
        ],
    },
    ...compat.extends('eslint:recommended', 'plugin:prettier/recommended', 'prettier'),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            ecmaVersion: 2020,
            sourceType: 'module',
        },

        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    printWidth: 120,
                    tabWidth: 4,
                    useTabs: false,
                },
            ],

            'no-console': 'off',
            'no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    argsIgnorePattern: 'create(Free|Business)UserAndLogin',
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    caughtErrors: 'none',
                },
            ],
        },
    },
];
