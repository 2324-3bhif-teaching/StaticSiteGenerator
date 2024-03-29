import type { Config } from 'jest';

const config: Config = {
    verbose: true,
};

module.exports = {
    roots: ["<rootDir>"],
    testMatch: [
        "**/__test__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    collectCoverage: true,
};

export default config;