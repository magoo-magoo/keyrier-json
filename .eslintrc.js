module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
            ecmaVersion: 2018,
            ecmaFeatures: { modules: true },
            sourceType: 'module',
        },
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    plugins: ['simple-import-sort', 'import'],
    extends: [
        'react-app',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',

        'plugin:promise/recommended',
        'plugin:import/typescript',
        'plugin:import/errors',

        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:jest-formatting/recommended',

        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',

        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    rules: {
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/restrict-template-expressions': 0,

        'react/prop-types': 0,

        'simple-import-sort/sort': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-unresolved': 0,
    },
    overrides: [
        {
            files: ['*.test.ts', '*.test.tsx'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 0,
            },
        },
    ],
}
