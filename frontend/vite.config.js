import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const devApiProxyTarget = process.env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: devApiProxyTarget,
          changeOrigin: true
        }
      }
    }
  };
});
