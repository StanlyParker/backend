import { type Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/tests/**/*.spec.ts', '<rootDir>/src/tests/**/*.e2e-spec.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
    verbose: true,
    collectCoverage: true,
    coverageDirectory: './coverage'
};

export default config;