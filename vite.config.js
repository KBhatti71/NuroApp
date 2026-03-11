import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // '@' maps to src/ so imports become: import Foo from '@/components/Foo'
      '@': resolve(__dirname, 'src'),
    },
  },

  // Expose VITE_* env vars to the browser bundle
  envPrefix: 'VITE_',
});
