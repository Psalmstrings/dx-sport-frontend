import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.js.org/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/elearning-api': {
        target: 'http://localhost:5001/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/elearning-api/, '')
      }
    }
  }
})
