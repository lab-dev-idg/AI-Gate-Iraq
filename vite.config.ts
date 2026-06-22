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
          manualChunks: {
            'react-core': ['react', 'react-dom', 'scheduler'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'google-ai': ['@google/genai'],
            markdown: ['react-markdown', 'rehype-raw'],
            'ui-vendor': [
              'lucide-react',
              'motion',
              'sonner',
              'next-themes',
              '@base-ui/react'
            ],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
