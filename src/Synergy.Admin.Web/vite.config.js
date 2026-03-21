import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para manifest do app externo em desenvolvimento (evita CORS)
      // Fetch de /proxy-manifest-nfe é encaminhado para http://localhost:5173/manifest.json
      '/proxy-manifest-nfe': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => '/manifest.json',
      },
    },
  },
})
