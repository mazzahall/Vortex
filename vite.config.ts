import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api-invidious-1': {
        target: 'https://invidious.f5.si',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-invidious-1/, ''),
      },
      '/api-invidious-2': {
        target: 'https://inv.nadeko.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-invidious-2/, ''),
      },
    },
  },
})