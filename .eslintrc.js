'use strict';
/* eslint-env: node */
const eslintConfig = {
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        }
    },
    plugins: [

    ],
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'eslint-config-aifejs',
    ],
    rules: {
        semi: ['error', 'always'],
        'comma-dangle': ['error', {
            arrays: 'always',
            objects: 'always',
            imports: 'always',
            exports: 'always',
            functions: 'ignore',
        }],
        'no-console': ['warn'],
        'indent': ['error', 4],
        'no-debugger': [process.env.NODE_ENV === 'production' ? 'error' : 'warn'],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
    },
};

module.exports = eslintConfig;
