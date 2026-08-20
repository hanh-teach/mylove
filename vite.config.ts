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
    build: {
      sourcemap: false,
      minify: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('@tiptap') || id.includes('prosemirror')) {
                return 'vendor-tiptap';
              }
              if (id.includes('jspdf') || id.includes('fflate')) {
                return 'vendor-jspdf';
              }
              if (id.includes('html2canvas') || id.includes('canvg')) {
                return 'vendor-html2canvas';
              }
              if (id.includes('docx') || id.includes('jszip') || id.includes('xml-js')) {
                return 'vendor-docx';
              }
              if (id.includes('reactflow')) {
                return 'vendor-reactflow';
              }
              if (id.includes('@supabase') || id.includes('@fal-ai') || id.includes('@google/genai') || id.includes('@huggingface') || id.includes('@runwayml')) {
                return 'vendor-ai-clients';
              }
            }
          }
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/language-tests/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
