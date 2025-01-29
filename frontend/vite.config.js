import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'styles/global.css'; // Import global styles

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Automatically opens in browser
  },
  build: {
    outDir: 'dist',
  },
});
