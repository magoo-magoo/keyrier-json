module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    plugins: ['simple-import-sort', 'import'],
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'react-app',
        'plugin:promise/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/typescript',
        'plugin:import/warnings',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:jest-formatting/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'react/prop-types': 0,
        'simple-import-sort/sort': 'error',
        'sort-imports': 'off',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
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
