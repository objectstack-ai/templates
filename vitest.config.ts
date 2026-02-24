import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@templates/todo': path.resolve(__dirname, 'templates/todo/src'),
      '@templates/blog': path.resolve(__dirname, 'templates/blog/src'),
      '@templates/inventory': path.resolve(__dirname, 'templates/inventory/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['templates/**/__tests__/**/*.ts', 'templates/**/?(*.)+(spec|test).ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      include: ['templates/**/src/**/*.ts'],
      exclude: [
        'templates/**/src/**/*.d.ts',
        'templates/**/src/**/*.test.ts',
        'templates/**/src/**/*.spec.ts',
        'templates/**/src/index.ts',
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
