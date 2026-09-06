import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    // Proxy API calls to our FastAPI backend
    // This avoids CORS issues during development
    proxy: {
      '/api': {
        target: 'https://nexora-e196.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'https://nexora-e196.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
