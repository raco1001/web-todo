import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    open: false, 
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    }
    
  },
});
