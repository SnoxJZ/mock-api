import tsconfigPaths from 'vite-tsconfig-paths'; // <--- Импорт
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    exclude: ['**/node_modules/**', '**/tests/**'],
  },
});
