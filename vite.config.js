import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // In dev, proxy /api/* to the local FastAPI backend so VITE_API_URL is not needed
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },

  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ['healthsnap-5.onrender.com', 'healthsnap-ten.vercel.app']
  }
})