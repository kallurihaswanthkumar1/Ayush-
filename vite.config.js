import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5274,
    strictPort: true,
    proxy: {
      '/api': { target: 'http://localhost:3000' },
      '/auth': { target: 'http://localhost:3000' },
    },
  },
});
