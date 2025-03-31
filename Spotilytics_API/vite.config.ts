import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['1063-64-121-109-176.ngrok-free.app', 'localhost', '192.168.0.70'],
  },
})
