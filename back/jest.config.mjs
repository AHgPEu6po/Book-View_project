export default {
    testEnvironment: "node",

    testMatch: [
        "**/tests/**/*.test.js",
        "**/?(*.)+(spec|test).[jt]s",
    ],

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",

    verbose: true,
};