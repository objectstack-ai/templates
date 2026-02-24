import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['apps/**/__tests__/**/*.ts', 'apps/**/?(*.)+(spec|test).ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      include: ['apps/**/src/**/*.ts'],
      exclude: [
        'apps/**/src/**/*.d.ts',
        'apps/**/src/**/*.test.ts',
        'apps/**/src/**/*.spec.ts',
        'apps/**/src/index.ts',
      ],
      thresholds: {
        branches: 70,
        functions: 75,
        lines: 80,
        statements: 80,
      },
    },
    testTimeout: 10000,
  },
});
