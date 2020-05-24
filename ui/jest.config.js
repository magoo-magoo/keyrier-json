module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/registerServiceWorker.ts',
        '!<rootDir>/node_modules/',
        '!<rootDir>/path/to/dir/',
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            lines: 40,
            statements: 40,
        },
    },
    moduleNameMapper: {
        'ace-builds': '<rootDir>/../node_modules/ace-builds',
    },
    transformIgnorePatterns: ['/!node_modules\\/lodash-es/'],
    coverageReporters: [
        [
            'lcov',
            {
                projectRoot: '..',
            },
        ],
    ],
}
