import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Raise the warning threshold to 1000kb (Spline runtime is inherently large)
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Spline 3D runtime — the heaviest dependency (~1.5MB)
            'vendor-spline': ['@splinetool/react-spline', '@splinetool/runtime'],
            // Animation library
            'vendor-motion': ['motion'],
            // Supabase client
            'vendor-supabase': ['@supabase/supabase-js'],
            // Icon library
            'vendor-lucide': ['lucide-react'],
            // React core
            'vendor-react': ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
