import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';

const normalizePath = (id: string) => id.replaceAll('\\', '/');

function manualChunks(id: string) {
  const moduleId = normalizePath(id);

  if (moduleId.includes('/node_modules/')) {
    if (
      moduleId.includes('/node_modules/react/') ||
      moduleId.includes('/node_modules/react-dom/') ||
      moduleId.includes('/node_modules/scheduler/')
    ) {
      return 'vendor-react';
    }

    if (moduleId.includes('/node_modules/firebase/') || moduleId.includes('/node_modules/@firebase/')) {
      if (moduleId.includes('/auth')) return 'vendor-firebase-auth';
      if (moduleId.includes('/firestore')) return 'vendor-firebase-firestore';
      if (moduleId.includes('/storage')) return 'vendor-firebase-storage';
      if (moduleId.includes('/app-check')) return 'vendor-firebase-app-check';
      return 'vendor-firebase-core';
    }

    if (moduleId.includes('/node_modules/@google/genai/')) return 'vendor-ai';

    if (
      moduleId.includes('/node_modules/react-markdown/') ||
      moduleId.includes('/node_modules/remark-') ||
      moduleId.includes('/node_modules/rehype-') ||
      moduleId.includes('/node_modules/mdast-') ||
      moduleId.includes('/node_modules/hast-') ||
      moduleId.includes('/node_modules/micromark') ||
      moduleId.includes('/node_modules/unified/')
    ) {
      return 'vendor-markdown';
    }

    if (moduleId.includes('/node_modules/lucide-react/')) return 'vendor-icons';
    if (moduleId.includes('/node_modules/motion/')) return 'vendor-motion';

    if (
      moduleId.includes('/node_modules/@base-ui/') ||
      moduleId.includes('/node_modules/sonner/') ||
      moduleId.includes('/node_modules/class-variance-authority/') ||
      moduleId.includes('/node_modules/clsx/') ||
      moduleId.includes('/node_modules/tailwind-merge/') ||
      moduleId.includes('/node_modules/next-themes/')
    ) {
      return 'vendor-ui';
    }

    return 'vendor-misc';
  }

  if (moduleId.includes('/src/admin/')) return 'feature-admin';
  if (moduleId.includes('/src/landing/')) return 'feature-landing';
  if (moduleId.includes('/src/features/assistant/')) return 'feature-assistant';
  if (moduleId.includes('/src/features/currency/') || moduleId.includes('/src/components/CurrencyConverter')) return 'workspace-currency';
  if (moduleId.includes('/src/features/cost/') || moduleId.includes('/src/components/ShippingCalculator')) return 'workspace-cost';
  if (moduleId.includes('/src/features/kyc/') || moduleId.includes('/src/components/KYCForm')) return 'workspace-kyc';
  if (moduleId.includes('/src/features/procurement/') || moduleId.includes('/src/components/ProcurementSourcing')) return 'workspace-procurement';
  if (moduleId.includes('/src/features/tracking/') || moduleId.includes('/src/components/ShipmentTracker')) return 'workspace-tracking';
  if (moduleId.includes('/src/features/map/') || moduleId.includes('/src/components/LogisticsMap')) return 'workspace-map';
  if (moduleId.includes('/src/features/market/')) return 'workspace-market';
  if (moduleId.includes('/src/features/borders/')) return 'workspace-borders';
  if (moduleId.includes('/src/features/audit/')) return 'workspace-audit';
  if (moduleId.includes('/src/features/inquiry/')) return 'workspace-inquiry';
  if (moduleId.includes('/src/app/')) return 'app-shell';

  return undefined;
}

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
          manualChunks,
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
