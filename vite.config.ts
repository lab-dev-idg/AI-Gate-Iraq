import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const googleMapsKey = env.VITE_GOOGLE_MAPS_API_KEY || '';

  return {
    plugins: [react(), tailwindcss(), cloudflare()],
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(googleMapsKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/react/') || id.includes('/react-dom/')) return 'react-core';
            if (id.includes('/firebase/')) return 'firebase';
            if (id.includes('/@google/genai/')) return 'google-ai';
            if (id.includes('/react-markdown/') || id.includes('/rehype-raw/')) return 'markdown';
            if (
              id.includes('/lucide-react/') ||
              id.includes('/motion/') ||
              id.includes('/sonner/') ||
              id.includes('/next-themes/') ||
              id.includes('/@base-ui/react/')
            ) return 'ui-vendor';
            return 'vendor';
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
