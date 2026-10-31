import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vercel serves from the root. Other hosts (raw.githack, local file) use relative paths.
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : './',
});
