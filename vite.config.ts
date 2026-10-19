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
      // Saat development, teruskan /api/* ke deployment Vercel
      '/api': {
        target: 'https://vortex-khaki-five.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})